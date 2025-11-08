-- ===========================================
-- QUICK FIX: Infinite Recursion Diagnostic
-- ===========================================

-- Check current RLS policies that might be causing recursion
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('projects', 'teams', 'tasks')
ORDER BY tablename, policyname;

-- Temporarily disable RLS to test project creation
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;

-- Try to create a test project
SELECT 'RLS temporarily disabled for teams and tasks' as status;

-- Query to see if project creation works now
SELECT 'Test project creation now...' as next_step;