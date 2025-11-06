-- ========================================
-- TEAM COLLABORATION FEATURE - MIGRATION
-- PPH - Personal Process Hub
-- Run this after all existing migrations
-- ========================================
-- This migration adds:
-- 1. Username system for user_profiles
-- 2. Teams table with workspace scoping
-- 3. Team members junction table
-- 4. Team activity logs for audit trail
-- 5. Extensions to tasks table for team assignment
-- 6. RLS policies for security
-- 7. Database triggers for automation
-- ========================================

BEGIN;

-- ========================================
-- 1. EXTEND USER_PROFILES TABLE
-- Add username functionality
-- ========================================

-- Add username column with constraints
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS username TEXT,
ADD COLUMN IF NOT EXISTS username_updated_at TIMESTAMP WITH TIME ZONE;

-- Add username format constraint (3-20 chars, alphanumeric + underscore)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'username_format'
  ) THEN
    ALTER TABLE user_profiles 
    ADD CONSTRAINT username_format CHECK (
      username ~ '^[a-zA-Z0-9_]{3,20}$'
    );
  END IF;
END $$;

-- Add lowercase constraint
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'username_lowercase'
  ) THEN
    ALTER TABLE user_profiles 
    ADD CONSTRAINT username_lowercase CHECK (
      username = LOWER(username)
    );
  END IF;
END $$;

-- Create unique index for case-insensitive username
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_username_unique 
ON user_profiles(LOWER(username));

-- Create indexes for fast username lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username_lower ON user_profiles(LOWER(username));

-- ========================================
-- 2. CREATE TEAMS TABLE
-- Teams are scoped to workspaces
-- ========================================

CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  avatar_url TEXT,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique team name within workspace (not globally unique)
  CONSTRAINT unique_team_name_per_workspace UNIQUE (workspace_id, name)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_teams_workspace_id ON teams(workspace_id);
CREATE INDEX IF NOT EXISTS idx_teams_admin_id ON teams(admin_id);
CREATE INDEX IF NOT EXISTS idx_teams_created_at ON teams(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_teams_is_active ON teams(is_active);

-- Add comment for documentation
COMMENT ON TABLE teams IS 'Teams scoped to workspaces for collaborative task management';
COMMENT ON COLUMN teams.admin_id IS 'User who created the team and has admin privileges';
COMMENT ON COLUMN teams.settings IS 'JSON object for team-specific settings and preferences';

-- ========================================
-- 3. CREATE TEAM_MEMBERS TABLE
-- Many-to-many relationship between users and teams
-- ========================================

CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Prevent duplicate memberships
  CONSTRAINT unique_team_member UNIQUE (team_id, user_id)
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members(role);
CREATE INDEX IF NOT EXISTS idx_team_members_joined_at ON team_members(joined_at DESC);

COMMENT ON TABLE team_members IS 'Junction table for users team memberships with roles';
COMMENT ON COLUMN team_members.role IS 'Member role: admin (can manage team) or member (regular access)';

-- ========================================
-- 4. EXTEND TASKS TABLE
-- Add team-related columns
-- ========================================

-- Add team columns to tasks
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for team queries
CREATE INDEX IF NOT EXISTS idx_tasks_team_id ON tasks(team_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_by ON tasks(assigned_by);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_at ON tasks(assigned_at DESC);

COMMENT ON COLUMN tasks.team_id IS 'Team this task belongs to (NULL for personal tasks)';
COMMENT ON COLUMN tasks.assigned_to IS 'User this task is assigned to';
COMMENT ON COLUMN tasks.assigned_by IS 'User who assigned this task';

-- ========================================
-- 5. CREATE TEAM_ACTIVITY_LOGS TABLE
-- Track team-related activities for audit trail
-- ========================================

CREATE TABLE IF NOT EXISTS team_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'member_added', 'member_removed', 'task_assigned', etc.
  entity_type TEXT,     -- 'member', 'task', 'team'
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_activity_logs_team_id ON team_activity_logs(team_id);
CREATE INDEX IF NOT EXISTS idx_team_activity_logs_user_id ON team_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_team_activity_logs_created_at ON team_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_team_activity_logs_action ON team_activity_logs(action);

COMMENT ON TABLE team_activity_logs IS 'Audit trail for all team-related activities';

-- ========================================
-- 6. DATABASE TRIGGERS
-- Automation for team management
-- ========================================

-- Trigger 1: Auto-generate default username on user creation
-- This runs when a new user profile is created without a username
CREATE OR REPLACE FUNCTION generate_default_username()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INTEGER := 0;
  user_email TEXT;
BEGIN
  -- Only generate if username is NULL
  IF NEW.username IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- Get user email from auth.users
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = NEW.id;

  -- Extract username from email (part before @)
  base_username := LOWER(REGEXP_REPLACE(
    SPLIT_PART(user_email, '@', 1),
    '[^a-z0-9_]', '_', 'g'
  ));
  
  -- Ensure it starts with a letter
  IF base_username !~ '^[a-z]' THEN
    base_username := 'user_' || base_username;
  END IF;
  
  -- Truncate to max 20 characters
  base_username := LEFT(base_username, 20);
  
  final_username := base_username;
  
  -- Check for uniqueness and add counter if needed
  WHILE EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE LOWER(username) = LOWER(final_username)
  ) LOOP
    counter := counter + 1;
    -- Leave room for counter suffix (_999 = 4 chars)
    final_username := LEFT(base_username, 16) || '_' || counter;
  END LOOP;
  
  NEW.username := final_username;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger to user_profiles
DROP TRIGGER IF EXISTS set_default_username ON user_profiles;
CREATE TRIGGER set_default_username
  BEFORE INSERT ON user_profiles
  FOR EACH ROW
  WHEN (NEW.username IS NULL)
  EXECUTE FUNCTION generate_default_username();

-- Trigger 2: Auto-add team admin as member
-- When a team is created, automatically add the creator as an admin member
CREATE OR REPLACE FUNCTION add_admin_as_member()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO team_members (team_id, user_id, role, invited_by)
  VALUES (NEW.id, NEW.admin_id, 'admin', NEW.admin_id)
  ON CONFLICT (team_id, user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS auto_add_admin_member ON teams;
CREATE TRIGGER auto_add_admin_member
  AFTER INSERT ON teams
  FOR EACH ROW
  EXECUTE FUNCTION add_admin_as_member();

-- Trigger 3: Log team activities
-- Automatically log member additions/removals
CREATE OR REPLACE FUNCTION log_team_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO team_activity_logs (team_id, user_id, action, entity_type, entity_id, metadata)
    VALUES (
      NEW.team_id,
      NEW.user_id,
      'member_added',
      'member',
      NEW.id,
      jsonb_build_object(
        'role', NEW.role,
        'invited_by', NEW.invited_by
      )
    );
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO team_activity_logs (team_id, user_id, action, entity_type, entity_id, metadata)
    VALUES (
      OLD.team_id,
      OLD.user_id,
      'member_removed',
      'member',
      OLD.id,
      jsonb_build_object('role', OLD.role)
    );
  ELSIF TG_OP = 'UPDATE' AND OLD.role != NEW.role THEN
    INSERT INTO team_activity_logs (team_id, user_id, action, entity_type, entity_id, metadata)
    VALUES (
      NEW.team_id,
      NEW.user_id,
      'role_changed',
      'member',
      NEW.id,
      jsonb_build_object(
        'old_role', OLD.role,
        'new_role', NEW.role
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS log_member_changes ON team_members;
CREATE TRIGGER log_member_changes
  AFTER INSERT OR DELETE OR UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION log_team_activity();

-- Trigger 4: Validate team-task workspace consistency
-- Ensure tasks assigned to teams belong to the same workspace
CREATE OR REPLACE FUNCTION validate_team_task_workspace()
RETURNS TRIGGER AS $$
DECLARE
  task_workspace_id UUID;
  team_workspace_id UUID;
BEGIN
  -- Only validate if team_id is set
  IF NEW.team_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Get workspace IDs
  task_workspace_id := NEW.workspace_id;
  
  SELECT workspace_id INTO team_workspace_id
  FROM teams
  WHERE id = NEW.team_id;
  
  -- Ensure they match
  IF task_workspace_id IS NOT NULL AND team_workspace_id IS NOT NULL THEN
    IF task_workspace_id != team_workspace_id THEN
      RAISE EXCEPTION 'Task and team must belong to the same workspace';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_team_task_workspace ON tasks;
CREATE TRIGGER check_team_task_workspace
  BEFORE INSERT OR UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION validate_team_task_workspace();

-- Trigger 5: Update updated_at timestamp for teams
CREATE OR REPLACE FUNCTION update_teams_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_teams_timestamp ON teams;
CREATE TRIGGER update_teams_timestamp
  BEFORE UPDATE ON teams
  FOR EACH ROW
  EXECUTE FUNCTION update_teams_updated_at();

-- ========================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- Secure access to team resources
-- ========================================

-- Enable RLS on all new tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_activity_logs ENABLE ROW LEVEL SECURITY;

-- ========================================
-- TEAMS TABLE POLICIES
-- ========================================

-- Policy: Users can view teams in their workspaces or teams they're members of
DROP POLICY IF EXISTS "Users can view teams" ON teams;
CREATE POLICY "Users can view teams"
  ON teams FOR SELECT
  USING (
    -- Can view teams in owned workspaces
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    OR
    -- Can view teams they're members of
    id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can create teams in their workspaces
DROP POLICY IF EXISTS "Users can create teams" ON teams;
CREATE POLICY "Users can create teams"
  ON teams FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    AND admin_id = auth.uid()
  );

-- Policy: Only team admins can update teams
DROP POLICY IF EXISTS "Team admins can update teams" ON teams;
CREATE POLICY "Team admins can update teams"
  ON teams FOR UPDATE
  USING (
    admin_id = auth.uid()
    OR
    id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    admin_id = auth.uid()
    OR
    id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Team admins or workspace owners can delete teams
DROP POLICY IF EXISTS "Admins can delete teams" ON teams;
CREATE POLICY "Admins can delete teams"
  ON teams FOR DELETE
  USING (
    admin_id = auth.uid()
    OR
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

-- ========================================
-- TEAM_MEMBERS TABLE POLICIES
-- ========================================

-- Policy: Users can view members of teams they're in
DROP POLICY IF EXISTS "Users can view team members" ON team_members;
CREATE POLICY "Users can view team members"
  ON team_members FOR SELECT
  USING (
    -- Team admins can view all members
    team_id IN (
      SELECT id FROM teams WHERE admin_id = auth.uid()
    )
    OR
    -- Members can view other members in their teams
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
    OR
    -- Workspace owners can view members in their workspace teams
    team_id IN (
      SELECT t.id FROM teams t
      JOIN workspaces w ON t.workspace_id = w.id
      WHERE w.user_id = auth.uid()
    )
  );

-- Policy: Only team admins can add members
DROP POLICY IF EXISTS "Team admins can add members" ON team_members;
CREATE POLICY "Team admins can add members"
  ON team_members FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT id FROM teams WHERE admin_id = auth.uid()
    )
    OR
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Team admins can update member roles
DROP POLICY IF EXISTS "Team admins can update members" ON team_members;
CREATE POLICY "Team admins can update members"
  ON team_members FOR UPDATE
  USING (
    team_id IN (
      SELECT id FROM teams WHERE admin_id = auth.uid()
    )
  )
  WITH CHECK (
    team_id IN (
      SELECT id FROM teams WHERE admin_id = auth.uid()
    )
  );

-- Policy: Team admins can remove members (except themselves)
DROP POLICY IF EXISTS "Team admins can remove members" ON team_members;
CREATE POLICY "Team admins can remove members"
  ON team_members FOR DELETE
  USING (
    team_id IN (
      SELECT id FROM teams WHERE admin_id = auth.uid()
    )
    AND user_id != auth.uid() -- Cannot remove themselves
  );

-- ========================================
-- TASKS TABLE - ADDITIONAL TEAM POLICIES
-- ========================================

-- Policy: Team members can view team tasks
DROP POLICY IF EXISTS "Team members can view team tasks" ON tasks;
CREATE POLICY "Team members can view team tasks"
  ON tasks FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- Policy: Team admins can manage team tasks
DROP POLICY IF EXISTS "Team admins can manage team tasks" ON tasks;
CREATE POLICY "Team admins can manage team tasks"
  ON tasks FOR UPDATE
  USING (
    team_id IN (
      SELECT id FROM teams WHERE admin_id = auth.uid()
    )
    OR
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Members can update their assigned tasks
DROP POLICY IF EXISTS "Members can update assigned tasks" ON tasks;
CREATE POLICY "Members can update assigned tasks"
  ON tasks FOR UPDATE
  USING (assigned_to = auth.uid())
  WITH CHECK (assigned_to = auth.uid());

-- ========================================
-- TEAM_ACTIVITY_LOGS TABLE POLICIES
-- ========================================

-- Policy: Users can view activity logs for teams they're in
DROP POLICY IF EXISTS "Users can view team activity logs" ON team_activity_logs;
CREATE POLICY "Users can view team activity logs"
  ON team_activity_logs FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
    OR
    team_id IN (
      SELECT t.id FROM teams t
      JOIN workspaces w ON t.workspace_id = w.id
      WHERE w.user_id = auth.uid()
    )
  );

-- ========================================
-- 8. HELPER FUNCTIONS
-- Reusable permission checks
-- ========================================

-- Check if user is team admin
CREATE OR REPLACE FUNCTION is_team_admin(team_uuid UUID, user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM teams 
    WHERE id = team_uuid AND admin_id = user_uuid
  )
  OR EXISTS (
    SELECT 1 FROM team_members
    WHERE team_id = team_uuid AND user_id = user_uuid AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is team member
CREATE OR REPLACE FUNCTION is_team_member(team_uuid UUID, user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_id = team_uuid AND user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has workspace access
CREATE OR REPLACE FUNCTION has_workspace_access(workspace_uuid UUID, user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM workspaces 
    WHERE id = workspace_uuid AND user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get team member count
CREATE OR REPLACE FUNCTION get_team_member_count(team_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) 
    FROM team_members 
    WHERE team_id = team_uuid
  )::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ========================================
-- 9. GRANT PERMISSIONS
-- ========================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.teams TO anon, authenticated;
GRANT ALL ON public.team_members TO anon, authenticated;
GRANT ALL ON public.team_activity_logs TO anon, authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION is_team_admin TO anon, authenticated;
GRANT EXECUTE ON FUNCTION is_team_member TO anon, authenticated;
GRANT EXECUTE ON FUNCTION has_workspace_access TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_team_member_count TO anon, authenticated;

COMMIT;

-- ========================================
-- MIGRATION COMPLETE
-- ========================================

-- Verify tables exist
DO $$
BEGIN
  RAISE NOTICE 'Team Collaboration Migration Complete!';
  RAISE NOTICE 'Tables created: teams, team_members, team_activity_logs';
  RAISE NOTICE 'User profiles extended with username functionality';
  RAISE NOTICE 'Tasks table extended with team assignment fields';
  RAISE NOTICE 'RLS policies enabled and configured';
  RAISE NOTICE 'Database triggers activated';
  RAISE NOTICE 'Helper functions available: is_team_admin, is_team_member, has_workspace_access';
END $$;
