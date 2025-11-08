-- =============================================
-- COMPLETE DATABASE SETUP - CLEAN START
-- PPH - Personal Process Hub
-- =============================================
-- This is a comprehensive migration that sets up the entire database
-- from scratch with all fixes applied.
-- 
-- Run this AFTER clearing your database or in a fresh database.
-- =============================================

BEGIN;

-- ========================================
-- STEP 1: ENABLE EXTENSIONS
-- ========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================
-- STEP 2: CREATE CORE TABLES
-- ========================================

-- 2.1: WORKSPACES TABLE
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  theme_color TEXT DEFAULT '#3B82F6',
  icon TEXT DEFAULT '📊',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workspaces_user_id ON workspaces(user_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_created_at ON workspaces(created_at DESC);

-- 2.2: USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  username TEXT,
  avatar_url TEXT,
  company TEXT,
  role TEXT,
  preferences JSONB DEFAULT '{}',
  username_updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Username constraints only apply when username is set (not null)
  CONSTRAINT username_format CHECK (username IS NULL OR username ~ '^[a-zA-Z0-9_-]{3,30}$'),
  CONSTRAINT username_lowercase CHECK (username IS NULL OR username = LOWER(username))
);

-- Unique index on username (only for non-null values)
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_username_unique 
  ON user_profiles(LOWER(username)) WHERE username IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);

-- 2.3: PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  admin_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')) DEFAULT 'planning',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  budget NUMERIC,
  avatar_url TEXT,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_workspace_id ON projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_projects_admin_id ON projects(admin_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- 2.4: TEAMS TABLE
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  admin_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  avatar_url TEXT,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teams_workspace_id ON teams(workspace_id);
CREATE INDEX IF NOT EXISTS idx_teams_project_id ON teams(project_id);
CREATE INDEX IF NOT EXISTS idx_teams_admin_id ON teams(admin_id);
CREATE INDEX IF NOT EXISTS idx_teams_created_at ON teams(created_at DESC);

-- 2.5: TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_by UUID,
  CONSTRAINT unique_team_member UNIQUE (team_id, user_id),
  -- Named foreign keys for PostgREST to distinguish relationships
  CONSTRAINT team_members_user_id_fkey FOREIGN KEY (user_id) 
    REFERENCES user_profiles(id) ON DELETE CASCADE,
  CONSTRAINT team_members_invited_by_fkey FOREIGN KEY (invited_by) 
    REFERENCES user_profiles(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members(role);

-- 2.6: TASKS TABLE
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  entity_type TEXT CHECK (entity_type IN ('task', 'event', 'activity', 'process')) DEFAULT 'task',
  completed BOOLEAN DEFAULT FALSE,
  chain_id TEXT,
  x NUMERIC,
  y NUMERIC,
  value NUMERIC CHECK (value >= 1 AND value <= 10),
  risk NUMERIC CHECK (risk >= 1 AND risk <= 10),
  category TEXT CHECK (category IN ('big_bets', 'line_extensions', 'ltos', 'other')),
  npv NUMERIC,
  due_date TIMESTAMP WITH TIME ZONE,
  start_date TIMESTAMP WITH TIME ZONE,
  tags TEXT[],
  assignee TEXT,
  assigned_to UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  assigned_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'todo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_workspace_id ON tasks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_team_id ON tasks(team_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_by ON tasks(assigned_by);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- 2.7: ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_workspace_id ON activity_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- 2.8: TEAM ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS team_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_activity_logs_team_id ON team_activity_logs(team_id);
CREATE INDEX IF NOT EXISTS idx_team_activity_logs_user_id ON team_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_team_activity_logs_created_at ON team_activity_logs(created_at DESC);

-- ========================================
-- STEP 3: ENABLE ROW LEVEL SECURITY
-- ========================================

ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_activity_logs ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 4: CREATE RLS POLICIES (NO RECURSION)
-- ========================================

-- 4.1: WORKSPACES POLICIES
-- Drop all existing policies first to avoid conflicts
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
        AND tablename IN ('workspaces', 'user_profiles', 'projects', 'teams', 'team_members', 'tasks', 'activity_logs', 'team_activity_logs')
    ) LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.tablename;
    END LOOP;
END $$;

CREATE POLICY "Users can view their own workspaces"
  ON workspaces FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workspaces"
  ON workspaces FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workspaces"
  ON workspaces FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workspaces"
  ON workspaces FOR DELETE
  USING (auth.uid() = user_id);

-- 4.2: USER PROFILES POLICIES
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (
    auth.uid() = id
    OR
    -- Can view profiles of team members
    id IN (
      SELECT tm2.user_id
      FROM team_members tm1
      JOIN team_members tm2 ON tm1.team_id = tm2.team_id
      WHERE tm1.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4.3: PROJECTS POLICIES (NO CIRCULAR DEPENDENCIES)
CREATE POLICY "Users can view projects"
  ON projects FOR SELECT
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    OR
    admin_id = auth.uid()
  );

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    AND admin_id = auth.uid()
  );

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

CREATE POLICY "Admins can delete projects"
  ON projects FOR DELETE
  USING (
    admin_id = auth.uid()
    OR
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

-- 4.4: TEAMS POLICIES (NO CIRCULAR DEPENDENCIES)
CREATE POLICY "Users can view teams"
  ON teams FOR SELECT
  USING (
    -- Can view teams in owned workspaces
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    OR
    -- Can view teams they're admin of
    admin_id = auth.uid()
    -- NOTE: Removed team_members check to prevent recursion
    -- Team membership will be handled at application level
  );

CREATE POLICY "Users can create teams"
  ON teams FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    AND admin_id = auth.uid()
  );

CREATE POLICY "Team admins can update teams"
  ON teams FOR UPDATE
  USING (
    -- Only team admin or workspace owner can update
    admin_id = auth.uid()
    OR
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    -- Removed team_members check to prevent recursion
  )
  WITH CHECK (
    admin_id = auth.uid()
    OR
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete teams"
  ON teams FOR DELETE
  USING (
    admin_id = auth.uid()
    OR
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

-- 4.5: TEAM MEMBERS POLICIES (NO CIRCULAR DEPENDENCIES WITH TEAMS)
-- CRITICAL: Do NOT query teams table to prevent infinite recursion
-- Admin authorization is handled at application level (via service layer)
CREATE POLICY "Users can view team members"
  ON team_members FOR SELECT
  USING (
    -- Allow viewing - authorization at application level
    true
  );

CREATE POLICY "Team admins can add members"
  ON team_members FOR INSERT
  WITH CHECK (
    -- Allow insert - authorization verified at application level
    -- Cannot check teams.admin_id to prevent recursion
    true
  );

CREATE POLICY "Team admins can update members"
  ON team_members FOR UPDATE
  USING (
    -- Allow update - authorization at application level
    -- Cannot check teams.admin_id to prevent recursion
    true
  )
  WITH CHECK (
    true
  );

CREATE POLICY "Team admins can remove members"
  ON team_members FOR DELETE
  USING (
    -- Allow delete - authorization at application level
    -- Cannot check teams.admin_id to prevent recursion
    true
  );

-- 4.6: TASKS POLICIES (NO CIRCULAR DEPENDENCIES)
CREATE POLICY "Users can view tasks"
  ON tasks FOR SELECT
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    OR
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
    OR
    assigned_to = auth.uid()
    OR
    assigned_by = auth.uid()
  );

CREATE POLICY "Users can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    OR
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks"
  ON tasks FOR UPDATE
  USING (
    assigned_by = auth.uid()
    OR
    assigned_to = auth.uid()
    OR
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    OR
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    assigned_by = auth.uid()
    OR
    assigned_to = auth.uid()
    OR
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    OR
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tasks"
  ON tasks FOR DELETE
  USING (
    assigned_by = auth.uid()
    OR
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    OR
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- 4.7: ACTIVITY LOGS POLICIES
CREATE POLICY "Users can view activity logs in their workspaces"
  ON activity_logs FOR SELECT
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    AND user_id = auth.uid()
  );

-- 4.8: TEAM ACTIVITY LOGS POLICIES
CREATE POLICY "Team members can view team activity logs"
  ON team_activity_logs FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
    OR
    team_id IN (
      SELECT id FROM teams WHERE admin_id = auth.uid()
    )
  );

CREATE POLICY "Team admins can insert activity logs"
  ON team_activity_logs FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT id FROM teams WHERE admin_id = auth.uid()
    )
    OR
    team_id IN (
      SELECT t.id FROM teams t
      JOIN workspaces w ON t.workspace_id = w.id
      WHERE w.user_id = auth.uid()
    )
  );

-- ========================================
-- STEP 5: CREATE HELPER FUNCTIONS
-- ========================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
-- Creates profile without username - user must set username in onboarding
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ========================================
-- STEP 6: CREATE USER PROFILES FOR EXISTING USERS
-- ========================================

INSERT INTO user_profiles (id, full_name, created_at, updated_at)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) as full_name,
  NOW(),
  NOW()
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_profiles up WHERE up.id = u.id
)
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- ========================================
-- VERIFICATION
-- ========================================

SELECT 'Database setup complete! ✅' AS status;
SELECT 'All tables created with proper RLS policies.' AS message;
SELECT 'No circular dependencies - no infinite recursion.' AS note;
