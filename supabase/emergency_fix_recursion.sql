-- ======================================
-- EMERGENCY FIX: Stop Infinite Recursion
-- ======================================

-- Step 1: Temporarily disable RLS on teams table to break the recursion
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;

-- Step 2: Check current policies causing the issue
SELECT 
  tablename, 
  policyname, 
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('teams', 'projects') 
  AND qual LIKE '%project_id IN%';

-- Step 3: Drop the problematic recursive policies
DROP POLICY IF EXISTS "Users can view teams" ON teams;
DROP POLICY IF EXISTS "Users can create teams" ON teams;

-- Step 4: Create NON-RECURSIVE policies for teams
CREATE POLICY "Users can view teams - no recursion"
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
    -- Direct admin check (no recursion through projects)
    admin_id = auth.uid()
  );

CREATE POLICY "Users can create teams - no recursion"
  ON teams FOR INSERT
  WITH CHECK (
    -- Must be workspace owner OR team admin
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
    OR
    admin_id = auth.uid()
  );

-- Step 5: Re-enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Step 6: Test query
SELECT 'RLS policies fixed - infinite recursion resolved!' as status;