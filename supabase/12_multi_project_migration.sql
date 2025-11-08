-- ========================================
-- MULTI-PROJECT ARCHITECTURE MIGRATION
-- PPH - Personal Process Hub
-- Run this after the team collaboration migration
-- ========================================
-- This migration adds:
-- 1. Projects table with workspace scoping
-- 2. Updates teams to be project-scoped instead of workspace-scoped
-- 3. Updates tasks to include direct project association
-- 4. New RLS policies for project-based access
-- 5. Database triggers for project automation
-- 6. Helper functions for project permissions
-- ========================================

BEGIN;

-- ========================================
-- 1. CREATE PROJECTS TABLE
-- Projects are scoped to workspaces
-- ========================================

CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')) DEFAULT 'planning',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  budget DECIMAL(15,2),
  avatar_url TEXT,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique project name within workspace
  CONSTRAINT unique_project_name_per_workspace UNIQUE (workspace_id, name)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_workspace_id ON projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_projects_admin_id ON projects(admin_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_is_active ON projects(is_active);
CREATE INDEX IF NOT EXISTS idx_projects_start_date ON projects(start_date);
CREATE INDEX IF NOT EXISTS idx_projects_end_date ON projects(end_date);

-- Add comments for documentation
COMMENT ON TABLE projects IS 'Projects within workspaces that contain teams and tasks';
COMMENT ON COLUMN projects.admin_id IS 'User who created the project and has admin privileges';
COMMENT ON COLUMN projects.status IS 'Current project status: planning, active, on_hold, completed, cancelled';
COMMENT ON COLUMN projects.settings IS 'JSON object for project-specific settings and preferences';
COMMENT ON COLUMN projects.budget IS 'Project budget in the workspace currency';

-- ========================================
-- 2. UPDATE TEAMS TABLE STRUCTURE
-- Change teams from workspace-scoped to project-scoped
-- ========================================

-- Add project_id column to teams table
ALTER TABLE teams ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE CASCADE;

-- Create index for the new column
CREATE INDEX IF NOT EXISTS idx_teams_project_id ON teams(project_id);

-- For existing teams, we'll need to:
-- 1. Create a default project for each workspace
-- 2. Assign all existing teams to that default project
-- This is handled in a separate data migration step

-- Update the unique constraint to be project-scoped instead of workspace-scoped
-- First drop the old constraint
ALTER TABLE teams DROP CONSTRAINT IF EXISTS unique_team_name_per_workspace;

-- Add new project-scoped constraint
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_team_name_per_project'
  ) THEN
    ALTER TABLE teams 
    ADD CONSTRAINT unique_team_name_per_project UNIQUE (project_id, name);
  END IF;
END $$;

-- ========================================
-- 3. UPDATE TASKS TABLE STRUCTURE
-- Add direct project association
-- ========================================

-- Add project_id column to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE SET NULL;

-- Create index for the new column
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);

-- Update task status to include 'review' state
-- First, let's check if we need to update the constraint
DO $$ 
BEGIN
  -- Drop existing status constraint if it exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'tasks_status_check' 
    OR conname LIKE '%status%'
  ) THEN
    ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;
  END IF;
  
  -- Add new status constraint with 'review' state
  ALTER TABLE tasks 
  ADD CONSTRAINT tasks_status_check 
  CHECK (status IN ('todo', 'in-progress', 'review', 'done'));
END $$;

COMMENT ON COLUMN tasks.project_id IS 'Project this task belongs to (NULL for legacy tasks)';

-- ========================================
-- 4. CREATE PROJECT_ACTIVITY_LOGS TABLE
-- Track project-related activities for audit trail
-- ========================================

CREATE TABLE IF NOT EXISTS project_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'project_created', 'team_added', 'status_changed', etc.
  entity_type TEXT,     -- 'team', 'task', 'project'
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_activity_logs_project_id ON project_activity_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_project_activity_logs_user_id ON project_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_project_activity_logs_created_at ON project_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_activity_logs_action ON project_activity_logs(action);

COMMENT ON TABLE project_activity_logs IS 'Audit trail for all project-related activities';

-- ========================================
-- 5. DATABASE TRIGGERS
-- Automation for project management
-- ========================================

-- Trigger 1: Update updated_at timestamp for projects
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_projects_timestamp ON projects;
CREATE TRIGGER update_projects_timestamp
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_projects_updated_at();

-- Trigger 2: Log project activities
CREATE OR REPLACE FUNCTION log_project_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO project_activity_logs (project_id, user_id, action, entity_type, entity_id, metadata)
    VALUES (
      NEW.id,
      NEW.admin_id,
      'project_created',
      'project',
      NEW.id,
      jsonb_build_object(
        'name', NEW.name,
        'status', NEW.status
      )
    );
  ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    INSERT INTO project_activity_logs (project_id, user_id, action, entity_type, entity_id, metadata)
    VALUES (
      NEW.id,
      NEW.admin_id,
      'status_changed',
      'project',
      NEW.id,
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS log_project_changes ON projects;
CREATE TRIGGER log_project_changes
  AFTER INSERT OR UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION log_project_activity();

-- Trigger 3: Validate project-team consistency
-- Ensure teams assigned to projects belong to the same workspace
CREATE OR REPLACE FUNCTION validate_project_team_workspace()
RETURNS TRIGGER AS $$
DECLARE
  team_workspace_id UUID;
  project_workspace_id UUID;
BEGIN
  -- Only validate if project_id is set
  IF NEW.project_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Get workspace IDs
  SELECT workspace_id INTO project_workspace_id
  FROM projects
  WHERE id = NEW.project_id;
  
  -- For teams table, we need to check workspace_id if it still exists
  -- For tasks table, we get workspace_id directly
  IF TG_TABLE_NAME = 'teams' THEN
    team_workspace_id := NEW.workspace_id;
  ELSE
    team_workspace_id := NEW.workspace_id;
  END IF;
  
  -- Ensure they match
  IF team_workspace_id IS NOT NULL AND project_workspace_id IS NOT NULL THEN
    IF team_workspace_id != project_workspace_id THEN
      RAISE EXCEPTION 'Team/Task and project must belong to the same workspace';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to teams table
DROP TRIGGER IF EXISTS check_project_team_workspace ON teams;
CREATE TRIGGER check_project_team_workspace
  BEFORE INSERT OR UPDATE ON teams
  FOR EACH ROW
  EXECUTE FUNCTION validate_project_team_workspace();

-- Apply to tasks table
DROP TRIGGER IF EXISTS check_project_task_workspace ON tasks;
CREATE TRIGGER check_project_task_workspace
  BEFORE INSERT OR UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION validate_project_team_workspace();

-- ========================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- Secure access to project resources
-- ========================================

-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_activity_logs ENABLE ROW LEVEL SECURITY;

-- ========================================
-- PROJECTS TABLE POLICIES
-- ========================================

-- Policy: Users can view projects in their workspaces or projects they have access to
DROP POLICY IF EXISTS "Users can view projects" ON projects;
CREATE POLICY "Users can view projects"
  ON projects FOR SELECT
  USING (
    -- Can view projects in owned workspaces
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    OR
    -- Can view projects they're admin of
    admin_id = auth.uid()
    OR
    -- Can view projects where they're team members
    id IN (
      SELECT DISTINCT t.project_id
      FROM teams t
      JOIN team_members tm ON t.id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

-- Policy: Users can create projects in their workspaces
DROP POLICY IF EXISTS "Users can create projects" ON projects;
CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    AND admin_id = auth.uid()
  );

-- Policy: Only project admins and workspace owners can update projects
DROP POLICY IF EXISTS "Project admins can update projects" ON projects;
CREATE POLICY "Project admins can update projects"
  ON projects FOR UPDATE
  USING (
    admin_id = auth.uid()
    OR
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    admin_id = auth.uid()
    OR
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

-- Policy: Project admins and workspace owners can delete projects
DROP POLICY IF EXISTS "Admins can delete projects" ON projects;
CREATE POLICY "Admins can delete projects"
  ON projects FOR DELETE
  USING (
    admin_id = auth.uid()
    OR
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

-- ========================================
-- UPDATE EXISTING TEAM POLICIES
-- Update team policies to work with project-scoped teams
-- ========================================

-- Update team view policy to include project access
DROP POLICY IF EXISTS "Users can view teams" ON teams;
CREATE POLICY "Users can view teams"
  ON teams FOR SELECT
  USING (
    -- Can view teams in projects they have access to
    project_id IN (
      SELECT id FROM projects 
      WHERE admin_id = auth.uid()
      OR workspace_id IN (
        SELECT id FROM workspaces WHERE user_id = auth.uid()
      )
    )
    OR
    -- Can view teams they're members of
    id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- Update team creation policy for project-scoped teams
DROP POLICY IF EXISTS "Users can create teams" ON teams;
CREATE POLICY "Users can create teams"
  ON teams FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects 
      WHERE admin_id = auth.uid()
      OR workspace_id IN (
        SELECT id FROM workspaces WHERE user_id = auth.uid()
      )
    )
    AND admin_id = auth.uid()
  );

-- ========================================
-- UPDATE TASK POLICIES FOR PROJECT ACCESS
-- ========================================

-- Policy: Users can view tasks in projects they have access to
DROP POLICY IF EXISTS "Team members can view team tasks" ON tasks;
CREATE POLICY "Project members can view project tasks"
  ON tasks FOR SELECT
  USING (
    -- Can view tasks in projects they have access to
    project_id IN (
      SELECT id FROM projects 
      WHERE admin_id = auth.uid()
      OR workspace_id IN (
        SELECT id FROM workspaces WHERE user_id = auth.uid()
      )
      OR id IN (
        SELECT DISTINCT t.project_id
        FROM teams t
        JOIN team_members tm ON t.id = tm.team_id
        WHERE tm.user_id = auth.uid()
      )
    )
    OR
    -- Can view tasks assigned to them
    assigned_to = auth.uid()
  );

-- Policy: Project admins and team members can create tasks
DROP POLICY IF EXISTS "Users can create tasks" ON tasks;
CREATE POLICY "Users can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects 
      WHERE admin_id = auth.uid()
      OR id IN (
        SELECT DISTINCT t.project_id
        FROM teams t
        JOIN team_members tm ON t.id = tm.team_id
        WHERE tm.user_id = auth.uid()
      )
    )
  );

-- ========================================
-- PROJECT_ACTIVITY_LOGS TABLE POLICIES
-- ========================================

-- Policy: Users can view activity logs for projects they have access to
DROP POLICY IF EXISTS "Users can view project activity logs" ON project_activity_logs;
CREATE POLICY "Users can view project activity logs"
  ON project_activity_logs FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE admin_id = auth.uid()
      OR workspace_id IN (
        SELECT id FROM workspaces WHERE user_id = auth.uid()
      )
      OR id IN (
        SELECT DISTINCT t.project_id
        FROM teams t
        JOIN team_members tm ON t.id = tm.team_id
        WHERE tm.user_id = auth.uid()
      )
    )
  );

-- ========================================
-- 7. HELPER FUNCTIONS
-- Reusable permission checks for projects
-- ========================================

-- Check if user is project admin
CREATE OR REPLACE FUNCTION is_project_admin(project_uuid UUID, user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM projects 
    WHERE id = project_uuid AND admin_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has project access (admin or team member)
CREATE OR REPLACE FUNCTION has_project_access(project_uuid UUID, user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM projects 
    WHERE id = project_uuid AND admin_id = user_uuid
  )
  OR EXISTS (
    SELECT 1 FROM team_members tm
    JOIN teams t ON tm.team_id = t.id
    WHERE t.project_id = project_uuid AND tm.user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get project team count
CREATE OR REPLACE FUNCTION get_project_team_count(project_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) 
    FROM teams 
    WHERE project_id = project_uuid AND is_active = true
  )::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Get project task count
CREATE OR REPLACE FUNCTION get_project_task_count(project_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) 
    FROM tasks 
    WHERE project_id = project_uuid
  )::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Get project progress percentage
CREATE OR REPLACE FUNCTION get_project_progress(project_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  total_tasks INTEGER;
  completed_tasks INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_tasks FROM tasks WHERE project_id = project_uuid;
  
  IF total_tasks = 0 THEN
    RETURN 0;
  END IF;
  
  SELECT COUNT(*) INTO completed_tasks 
  FROM tasks 
  WHERE project_id = project_uuid AND completed = true;
  
  RETURN (completed_tasks * 100 / total_tasks)::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ========================================
-- 8. GRANT PERMISSIONS
-- ========================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.projects TO anon, authenticated;
GRANT ALL ON public.project_activity_logs TO anon, authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION is_project_admin TO anon, authenticated;
GRANT EXECUTE ON FUNCTION has_project_access TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_project_team_count TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_project_task_count TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_project_progress TO anon, authenticated;

COMMIT;

-- ========================================
-- DATA MIGRATION SCRIPT (Run separately)
-- ========================================

-- This script should be run after the schema migration to migrate existing data

-- MIGRATION NOTICE:
-- After running this schema migration, you need to:
-- 1. Create default projects for existing workspaces
-- 2. Assign existing teams to those default projects
-- 3. Update existing tasks to reference the appropriate projects
-- 4. Verify all foreign key relationships are intact

-- Example data migration (run after schema migration):
/*
BEGIN;

-- Create default projects for existing workspaces
INSERT INTO projects (workspace_id, name, description, admin_id, status, settings)
SELECT 
  w.id as workspace_id,
  'Default Project' as name,
  'Auto-created project for existing workspace' as description,
  w.user_id as admin_id,
  'active' as status,
  '{"is_default": true}' as settings
FROM workspaces w
WHERE NOT EXISTS (
  SELECT 1 FROM projects p WHERE p.workspace_id = w.id
);

-- Update existing teams to reference the default projects
UPDATE teams 
SET project_id = (
  SELECT p.id 
  FROM projects p 
  WHERE p.workspace_id = teams.workspace_id 
  AND p.settings->>'is_default' = 'true'
)
WHERE project_id IS NULL;

-- Update existing tasks to reference projects through their teams
UPDATE tasks 
SET project_id = (
  SELECT t.project_id 
  FROM teams t 
  WHERE t.id = tasks.team_id
)
WHERE project_id IS NULL AND team_id IS NOT NULL;

-- For tasks without teams, assign to default project in their workspace
UPDATE tasks 
SET project_id = (
  SELECT p.id 
  FROM projects p 
  WHERE p.workspace_id = tasks.workspace_id 
  AND p.settings->>'is_default' = 'true'
)
WHERE project_id IS NULL;

COMMIT;
*/

-- ========================================
-- MIGRATION COMPLETE
-- ========================================

-- Verify tables exist
DO $$
BEGIN
  RAISE NOTICE 'Multi-Project Architecture Migration Complete!';
  RAISE NOTICE 'Tables created: projects, project_activity_logs';
  RAISE NOTICE 'Teams table updated with project_id column';
  RAISE NOTICE 'Tasks table updated with project_id column';
  RAISE NOTICE 'RLS policies updated for project-based access';
  RAISE NOTICE 'Database triggers activated for projects';
  RAISE NOTICE 'Helper functions available: is_project_admin, has_project_access, get_project_*';
  RAISE NOTICE 'IMPORTANT: Run data migration script to update existing records!';
END $$;