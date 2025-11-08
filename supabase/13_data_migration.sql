-- ========================================
-- DATA MIGRATION FOR MULTI-PROJECT ARCHITECTURE
-- PPH - Personal Process Hub
-- Run this AFTER the schema migration (12_multi_project_migration.sql)
-- ========================================
-- This script migrates existing data to the new multi-project structure:
-- 1. Creates default projects for existing workspaces  
-- 2. Assigns existing teams to default projects
-- 3. Updates existing tasks to reference projects
-- 4. Validates data integrity after migration
-- 5. Creates sample projects for demonstration
-- ========================================

BEGIN;

-- ========================================
-- 1. BACKUP VALIDATION
-- Check current state before migration
-- ========================================

DO $$
DECLARE
  workspace_count INTEGER;
  team_count INTEGER;
  task_count INTEGER;
  existing_project_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO workspace_count FROM workspaces;
  SELECT COUNT(*) INTO team_count FROM teams;
  SELECT COUNT(*) INTO task_count FROM tasks;
  SELECT COUNT(*) INTO existing_project_count FROM projects;
  
  RAISE NOTICE 'PRE-MIGRATION STATE:';
  RAISE NOTICE '  Workspaces: %', workspace_count;
  RAISE NOTICE '  Teams: %', team_count;
  RAISE NOTICE '  Tasks: %', task_count;
  RAISE NOTICE '  Existing Projects: %', existing_project_count;
  
  -- Verify schema is ready
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'id') THEN
    RAISE EXCEPTION 'Projects table not found. Run schema migration first.';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'project_id') THEN
    RAISE EXCEPTION 'Teams.project_id column not found. Run schema migration first.';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'project_id') THEN
    RAISE EXCEPTION 'Tasks.project_id column not found. Run schema migration first.';
  END IF;
  
  RAISE NOTICE 'Schema validation passed. Starting data migration...';
END $$;

-- ========================================
-- 2. CREATE DEFAULT PROJECTS
-- Create one default project per workspace for existing teams/tasks
-- ========================================

INSERT INTO projects (
  workspace_id, 
  name, 
  description, 
  admin_id, 
  status, 
  settings,
  created_at,
  updated_at
)
SELECT 
  w.id as workspace_id,
  'Default Project' as name,
  'Auto-created project for migrating existing teams and tasks to the new multi-project structure.' as description,
  w.user_id as admin_id,
  'active' as status,
  jsonb_build_object(
    'is_default', true,
    'auto_created', true,
    'migration_date', NOW()::text
  ) as settings,
  NOW() as created_at,
  NOW() as updated_at
FROM workspaces w
WHERE NOT EXISTS (
  SELECT 1 FROM projects p 
  WHERE p.workspace_id = w.id 
  AND p.settings->>'is_default' = 'true'
)
ORDER BY w.created_at;

-- Log how many default projects were created
DO $$
DECLARE
  created_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO created_count 
  FROM projects 
  WHERE settings->>'is_default' = 'true'
  AND settings->>'auto_created' = 'true';
  
  RAISE NOTICE 'Created % default projects', created_count;
END $$;

-- ========================================
-- 3. MIGRATE TEAMS TO PROJECTS
-- Assign existing teams to their workspace's default project
-- ========================================

-- Update teams that don't have a project_id yet
UPDATE teams 
SET project_id = (
  SELECT p.id 
  FROM projects p 
  WHERE p.workspace_id = teams.workspace_id 
  AND p.settings->>'is_default' = 'true'
  LIMIT 1
)
WHERE project_id IS NULL
AND workspace_id IS NOT NULL;

-- Verify team migration
DO $$
DECLARE
  updated_teams INTEGER;
  orphaned_teams INTEGER;
BEGIN
  SELECT COUNT(*) INTO updated_teams 
  FROM teams 
  WHERE project_id IS NOT NULL;
  
  SELECT COUNT(*) INTO orphaned_teams 
  FROM teams 
  WHERE project_id IS NULL;
  
  RAISE NOTICE 'Teams migration: % teams assigned to projects, % orphaned teams', updated_teams, orphaned_teams;
  
  IF orphaned_teams > 0 THEN
    RAISE WARNING 'Found % teams without project assignment. Manual review required.', orphaned_teams;
  END IF;
END $$;

-- ========================================
-- 4. MIGRATE TASKS TO PROJECTS
-- Assign existing tasks to projects through their teams first,
-- then directly to workspace default projects for teamless tasks
-- ========================================

-- Step 4a: Update tasks that belong to teams
UPDATE tasks 
SET project_id = (
  SELECT t.project_id 
  FROM teams t 
  WHERE t.id = tasks.team_id
)
WHERE project_id IS NULL 
AND team_id IS NOT NULL;

-- Step 4b: Update remaining tasks (without teams) to workspace default projects
UPDATE tasks 
SET project_id = (
  SELECT p.id 
  FROM projects p 
  WHERE p.workspace_id = tasks.workspace_id 
  AND p.settings->>'is_default' = 'true'
  LIMIT 1
)
WHERE project_id IS NULL 
AND workspace_id IS NOT NULL;

-- Verify task migration
DO $$
DECLARE
  updated_tasks INTEGER;
  orphaned_tasks INTEGER;
BEGIN
  SELECT COUNT(*) INTO updated_tasks 
  FROM tasks 
  WHERE project_id IS NOT NULL;
  
  SELECT COUNT(*) INTO orphaned_tasks 
  FROM tasks 
  WHERE project_id IS NULL;
  
  RAISE NOTICE 'Tasks migration: % tasks assigned to projects, % orphaned tasks', updated_tasks, orphaned_tasks;
  
  IF orphaned_tasks > 0 THEN
    RAISE WARNING 'Found % tasks without project assignment. Manual review required.', orphaned_tasks;
  END IF;
END $$;

-- ========================================
-- 5. CREATE SAMPLE PROJECTS
-- Add some example projects for demonstration
-- ========================================

-- Create sample projects for the first few workspaces
INSERT INTO projects (
  workspace_id,
  name,
  description,
  admin_id,
  status,
  start_date,
  settings
)
SELECT 
  w.id as workspace_id,
  project_data.name,
  project_data.description,
  w.user_id as admin_id,
  project_data.status,
  NOW() as start_date,
  project_data.settings
FROM workspaces w
CROSS JOIN (
  VALUES 
    (
      'Website Redesign',
      'Complete overhaul of company website with modern design and improved user experience',
      'planning',
      '{"priority": "high", "tags": ["design", "development", "marketing"]}'::jsonb
    ),
    (
      'Mobile App Development', 
      'Native mobile application for iOS and Android platforms',
      'active',
      '{"priority": "medium", "tags": ["mobile", "development", "ios", "android"]}'::jsonb
    ),
    (
      'Process Documentation',
      'Document all internal processes and create knowledge base',
      'active', 
      '{"priority": "low", "tags": ["documentation", "processes", "knowledge"]}'::jsonb
    )
) AS project_data(name, description, status, settings)
WHERE w.created_at >= NOW() - INTERVAL '30 days' -- Only recent workspaces
LIMIT 9 -- Max 3 projects per workspace, 3 workspaces
ON CONFLICT (workspace_id, name) DO NOTHING;

-- Log sample project creation
DO $$
DECLARE
  sample_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO sample_count 
  FROM projects 
  WHERE settings->>'is_default' != 'true'
  AND created_at >= NOW() - INTERVAL '1 minute';
  
  RAISE NOTICE 'Created % sample projects', sample_count;
END $$;

-- ========================================
-- 6. DATA INTEGRITY VALIDATION
-- Verify migration completed successfully
-- ========================================

DO $$
DECLARE
  total_workspaces INTEGER;
  total_projects INTEGER;
  projects_with_default INTEGER;
  teams_with_projects INTEGER;
  tasks_with_projects INTEGER;
  consistency_errors INTEGER := 0;
BEGIN
  -- Get counts
  SELECT COUNT(*) INTO total_workspaces FROM workspaces;
  SELECT COUNT(*) INTO total_projects FROM projects;
  SELECT COUNT(*) INTO projects_with_default FROM projects WHERE settings->>'is_default' = 'true';
  SELECT COUNT(*) INTO teams_with_projects FROM teams WHERE project_id IS NOT NULL;
  SELECT COUNT(*) INTO tasks_with_projects FROM tasks WHERE project_id IS NOT NULL;
  
  RAISE NOTICE '';
  RAISE NOTICE 'POST-MIGRATION VALIDATION:';
  RAISE NOTICE '  Total Workspaces: %', total_workspaces;
  RAISE NOTICE '  Total Projects: %', total_projects;
  RAISE NOTICE '  Default Projects: %', projects_with_default;
  RAISE NOTICE '  Teams with Projects: %', teams_with_projects;
  RAISE NOTICE '  Tasks with Projects: %', tasks_with_projects;
  
  -- Validation checks
  RAISE NOTICE '';
  RAISE NOTICE 'INTEGRITY CHECKS:';
  
  -- Check 1: Every workspace should have at least one project
  IF total_workspaces != projects_with_default THEN
    RAISE WARNING 'FAIL: Not all workspaces have default projects (% workspaces, % default projects)', 
                  total_workspaces, projects_with_default;
    consistency_errors := consistency_errors + 1;
  ELSE
    RAISE NOTICE 'PASS: All workspaces have default projects';
  END IF;
  
  -- Check 2: Project-team workspace consistency
  IF EXISTS (
    SELECT 1 FROM teams t
    JOIN projects p ON t.project_id = p.id
    WHERE t.workspace_id != p.workspace_id
  ) THEN
    RAISE WARNING 'FAIL: Found teams and projects in different workspaces';
    consistency_errors := consistency_errors + 1;
  ELSE
    RAISE NOTICE 'PASS: All teams belong to projects in same workspace';
  END IF;
  
  -- Check 3: Project-task workspace consistency  
  IF EXISTS (
    SELECT 1 FROM tasks t
    JOIN projects p ON t.project_id = p.id
    WHERE t.workspace_id != p.workspace_id
  ) THEN
    RAISE WARNING 'FAIL: Found tasks and projects in different workspaces';
    consistency_errors := consistency_errors + 1;
  ELSE
    RAISE NOTICE 'PASS: All tasks belong to projects in same workspace';
  END IF;
  
  -- Check 4: Foreign key integrity
  IF EXISTS (SELECT 1 FROM teams WHERE project_id IS NOT NULL AND project_id NOT IN (SELECT id FROM projects)) THEN
    RAISE WARNING 'FAIL: Found teams with invalid project_id references';
    consistency_errors := consistency_errors + 1;
  ELSE
    RAISE NOTICE 'PASS: All team project references are valid';
  END IF;
  
  IF EXISTS (SELECT 1 FROM tasks WHERE project_id IS NOT NULL AND project_id NOT IN (SELECT id FROM projects)) THEN
    RAISE WARNING 'FAIL: Found tasks with invalid project_id references';
    consistency_errors := consistency_errors + 1;
  ELSE
    RAISE NOTICE 'PASS: All task project references are valid';
  END IF;
  
  -- Final result
  RAISE NOTICE '';
  IF consistency_errors = 0 THEN
    RAISE NOTICE 'MIGRATION SUCCESSFUL: All integrity checks passed!';
  ELSE
    RAISE WARNING 'MIGRATION COMPLETED WITH % ERRORS: Manual review required', consistency_errors;
  END IF;
END $$;

-- ========================================
-- 7. UPDATE STATISTICS
-- Refresh database statistics for better query performance
-- ========================================

ANALYZE projects;
ANALYZE teams;
ANALYZE tasks;
ANALYZE project_activity_logs;

-- ========================================
-- 8. CLEANUP RECOMMENDATIONS
-- ========================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE 'POST-MIGRATION RECOMMENDATIONS:';
  RAISE NOTICE '1. Review any orphaned teams/tasks reported above';
  RAISE NOTICE '2. Test the ProjectService in your application';
  RAISE NOTICE '3. Update UI components to support project selection';
  RAISE NOTICE '4. Consider making teams.workspace_id optional in future migration';
  RAISE NOTICE '5. Update API endpoints to filter by project_id';
  RAISE NOTICE '6. Test RLS policies with different user roles';
  RAISE NOTICE '';
  RAISE NOTICE 'NEXT STEPS:';
  RAISE NOTICE '- Update TeamService to use project-based filtering'; 
  RAISE NOTICE '- Update TaskService to include project_id in queries';
  RAISE NOTICE '- Create ProjectCreationModal component';
  RAISE NOTICE '- Add project selector to navigation';
  RAISE NOTICE '- Update existing views to support project filtering';
END $$;

COMMIT;

-- ========================================
-- MIGRATION DATA SUMMARY
-- ========================================

-- Final summary query to show the migrated data structure
SELECT 
  'WORKSPACE' as entity_type,
  w.name as entity_name,
  w.id as entity_id,
  NULL as parent_type,
  NULL as parent_name,
  (SELECT COUNT(*) FROM projects WHERE workspace_id = w.id) as child_count
FROM workspaces w

UNION ALL

SELECT 
  'PROJECT' as entity_type,
  p.name as entity_name, 
  p.id as entity_id,
  'WORKSPACE' as parent_type,
  w.name as parent_name,
  (SELECT COUNT(*) FROM teams WHERE project_id = p.id) as child_count
FROM projects p
JOIN workspaces w ON p.workspace_id = w.id

UNION ALL

SELECT 
  'TEAM' as entity_type,
  t.name as entity_name,
  t.id as entity_id, 
  'PROJECT' as parent_type,
  p.name as parent_name,
  (SELECT COUNT(*) FROM tasks WHERE team_id = t.id) as child_count
FROM teams t
JOIN projects p ON t.project_id = p.id

ORDER BY entity_type, entity_name;