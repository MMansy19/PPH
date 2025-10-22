-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Project Portfolio Hub - Data Isolation
-- ========================================
-- Run this file AFTER 01_schema.sql
-- Ensures users only access their own data
-- ========================================

-- ========================================
-- ENABLE RLS ON ALL TABLES
-- ========================================

ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ========================================
-- WORKSPACES POLICIES
-- ========================================
-- Users can only see/manage their own workspaces

-- SELECT: Users can view their own workspaces
CREATE POLICY "Users can view their own workspaces"
  ON workspaces
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can create workspaces
CREATE POLICY "Users can create their own workspaces"
  ON workspaces
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update their own workspaces
CREATE POLICY "Users can update their own workspaces"
  ON workspaces
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can delete their own workspaces
CREATE POLICY "Users can delete their own workspaces"
  ON workspaces
  FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- TASKS POLICIES
-- ========================================
-- Users can only access tasks in their workspaces

-- SELECT: Users can view tasks in their workspaces
CREATE POLICY "Users can view tasks in their workspaces"
  ON tasks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = tasks.workspace_id
      AND workspaces.user_id = auth.uid()
    )
  );

-- INSERT: Users can create tasks in their workspaces
CREATE POLICY "Users can create tasks in their workspaces"
  ON tasks
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = tasks.workspace_id
      AND workspaces.user_id = auth.uid()
    )
  );

-- UPDATE: Users can update tasks in their workspaces
CREATE POLICY "Users can update tasks in their workspaces"
  ON tasks
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = tasks.workspace_id
      AND workspaces.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = tasks.workspace_id
      AND workspaces.user_id = auth.uid()
    )
  );

-- DELETE: Users can delete tasks in their workspaces
CREATE POLICY "Users can delete tasks in their workspaces"
  ON tasks
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = tasks.workspace_id
      AND workspaces.user_id = auth.uid()
    )
  );

-- ========================================
-- USER PROFILES POLICIES
-- ========================================
-- Users can only manage their own profile

-- SELECT: Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- INSERT: Users can create their own profile
CREATE POLICY "Users can create their own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- UPDATE: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- DELETE: Users can delete their own profile
CREATE POLICY "Users can delete their own profile"
  ON user_profiles
  FOR DELETE
  USING (auth.uid() = id);

-- ========================================
-- ACTIVITY LOGS POLICIES
-- ========================================
-- Users can only view logs in their workspaces

-- SELECT: Users can view activity logs in their workspaces
CREATE POLICY "Users can view activity logs in their workspaces"
  ON activity_logs
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = activity_logs.workspace_id
      AND workspaces.user_id = auth.uid()
    )
  );

-- INSERT: System can insert logs (authenticated users)
CREATE POLICY "Authenticated users can create activity logs"
  ON activity_logs
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ========================================
-- SUCCESS MESSAGE
-- ========================================
DO $$
BEGIN
  RAISE NOTICE 'RLS policies created successfully! ✅';
  RAISE NOTICE 'Your data is now secured with row-level security';
  RAISE NOTICE 'Next step: Run 03_functions.sql';
END $$;
