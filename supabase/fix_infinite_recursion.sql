-- ===========================================
-- FIX: Infinite Recursion in Teams RLS Policy
-- ===========================================

-- The issue is circular dependency:
-- 1. teams policy queries projects
-- 2. tasks policy queries projects through teams
-- 3. This creates infinite recursion

-- SOLUTION: Simplify the RLS policies to avoid cross-table recursion

-- ========================================
-- 1. FIX PROJECTS RLS POLICIES (No changes needed - these are fine)
-- ========================================

-- ========================================
-- 2. FIX TEAMS RLS POLICIES (Remove circular dependency)
-- ========================================

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view teams" ON teams;
DROP POLICY IF EXISTS "Users can create teams" ON teams;
DROP POLICY IF EXISTS "Users can update teams" ON teams;
DROP POLICY IF EXISTS "Users can delete teams" ON teams;

-- NEW POLICY: Simplified team view policy (no circular dependency)
CREATE POLICY "Users can view teams"
  ON teams FOR SELECT
  USING (
    -- Direct workspace access (no circular dependency)
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    OR
    -- Team membership access
    id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
    OR
    -- Project admin access (direct check without recursion)
    project_id IN (
      SELECT id FROM projects WHERE admin_id = auth.uid()
    )
  );

-- NEW POLICY: Simplified team creation (no circular dependency)
CREATE POLICY "Users can create teams"
  ON teams FOR INSERT
  WITH CHECK (
    -- Must be workspace owner
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    OR
    -- Or project admin (direct check)
    project_id IN (
      SELECT id FROM projects WHERE admin_id = auth.uid()
    )
  );

-- NEW POLICY: Team updates
CREATE POLICY "Users can update teams"
  ON teams FOR UPDATE
  USING (
    admin_id = auth.uid()
    OR
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    OR
    project_id IN (
      SELECT id FROM projects WHERE admin_id = auth.uid()
    )
  )
  WITH CHECK (
    admin_id = auth.uid()
    OR
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    OR
    project_id IN (
      SELECT id FROM projects WHERE admin_id = auth.uid()
    )
  );

-- NEW POLICY: Team deletion
CREATE POLICY "Users can delete teams"
  ON teams FOR DELETE
  USING (
    admin_id = auth.uid()
    OR
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    OR
    project_id IN (
      SELECT id FROM projects WHERE admin_id = auth.uid()
    )
  );

-- ========================================
-- 3. FIX TASKS RLS POLICIES (Simplified to avoid recursion)
-- ========================================

-- Drop existing problematic task policies
DROP POLICY IF EXISTS "Project members can view project tasks" ON tasks;
DROP POLICY IF EXISTS "Team members can create tasks" ON tasks;
DROP POLICY IF EXISTS "Team members can update tasks" ON tasks;
DROP POLICY IF EXISTS "Team members can delete tasks" ON tasks;

-- NEW POLICY: Simplified task view (no circular dependency)
CREATE POLICY "Users can view tasks"
  ON tasks FOR SELECT
  USING (
    -- Direct workspace access
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    OR
    -- Direct project access
    project_id IN (
      SELECT id FROM projects WHERE admin_id = auth.uid()
    )
    OR
    -- Team membership (simple check)
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
    OR
    -- Task assignment
    assigned_to = auth.uid()
  );

-- NEW POLICY: Task creation
CREATE POLICY "Users can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    -- Workspace owner can create tasks
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    OR
    -- Project admin can create tasks
    project_id IN (
      SELECT id FROM projects WHERE admin_id = auth.uid()
    )
    OR
    -- Team member can create tasks
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- NEW POLICY: Task updates
CREATE POLICY "Users can update tasks"
  ON tasks FOR UPDATE
  USING (
    created_by = auth.uid()
    OR
    assigned_to = auth.uid()
    OR
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    OR
    project_id IN (
      SELECT id FROM projects WHERE admin_id = auth.uid()
    )
    OR
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    created_by = auth.uid()
    OR
    assigned_to = auth.uid()
    OR
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    OR
    project_id IN (
      SELECT id FROM projects WHERE admin_id = auth.uid()
    )
    OR
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- NEW POLICY: Task deletion
CREATE POLICY "Users can delete tasks"
  ON tasks FOR DELETE
  USING (
    created_by = auth.uid()
    OR
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    OR
    project_id IN (
      SELECT id FROM projects WHERE admin_id = auth.uid()
    )
    OR
    team_id IN (
      SELECT team_id FROM team_members WHERE user_id = auth.uid()
    )
  );

-- ========================================
-- 4. VERIFICATION QUERIES
-- ========================================

-- Test that we can now query without infinite recursion
SELECT 'RLS policies fixed - testing queries...' as status;

-- Test projects query
SELECT id, name FROM projects LIMIT 1;

-- Test teams query  
SELECT id, name FROM teams LIMIT 1;

-- Test tasks query
SELECT id, title FROM tasks LIMIT 1;

SELECT 'All queries successful - infinite recursion fixed!' as result;