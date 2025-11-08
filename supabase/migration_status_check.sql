-- ========================================
-- MIGRATION STATUS CHECK SCRIPT
-- PPH - Personal Process Hub
-- Run this to verify migration completed successfully
-- ========================================

DO $$
DECLARE
    workspace_count INTEGER;
    project_count INTEGER;
    team_count INTEGER;
    task_count INTEGER;
    teams_with_projects INTEGER;
    tasks_with_projects INTEGER;
    orphaned_teams INTEGER;
    orphaned_tasks INTEGER;
    rls_enabled INTEGER;
    functions_count INTEGER;
BEGIN
    -- Get counts
    SELECT COUNT(*) INTO workspace_count FROM workspaces;
    SELECT COUNT(*) INTO project_count FROM projects;
    SELECT COUNT(*) INTO team_count FROM teams;
    SELECT COUNT(*) INTO task_count FROM tasks;
    SELECT COUNT(*) INTO teams_with_projects FROM teams WHERE project_id IS NOT NULL;
    SELECT COUNT(*) INTO tasks_with_projects FROM tasks WHERE project_id IS NOT NULL;
    SELECT COUNT(*) INTO orphaned_teams FROM teams WHERE project_id IS NULL;
    SELECT COUNT(*) INTO orphaned_tasks FROM tasks WHERE project_id IS NULL;
    
    -- Check RLS
    SELECT COUNT(*) INTO rls_enabled 
    FROM pg_tables 
    WHERE tablename IN ('projects', 'teams', 'tasks') 
    AND rowsecurity = true;
    
    -- Check functions
    SELECT COUNT(*) INTO functions_count 
    FROM information_schema.routines 
    WHERE routine_name LIKE '%project%' 
    AND routine_schema = 'public';

    -- Display results
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'MIGRATION STATUS REPORT';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'DATA SUMMARY:';
    RAISE NOTICE '  Workspaces: %', workspace_count;
    RAISE NOTICE '  Projects: %', project_count;
    RAISE NOTICE '  Teams: % (% with projects)', team_count, teams_with_projects;
    RAISE NOTICE '  Tasks: % (% with projects)', task_count, tasks_with_projects;
    RAISE NOTICE '';
    
    -- Check for issues
    IF orphaned_teams > 0 THEN
        RAISE WARNING 'ISSUE: % teams without project assignment', orphaned_teams;
    ELSE
        RAISE NOTICE 'SUCCESS: All teams assigned to projects';
    END IF;
    
    IF orphaned_tasks > 0 THEN
        RAISE WARNING 'ISSUE: % tasks without project assignment', orphaned_tasks;
    ELSE
        RAISE NOTICE 'SUCCESS: All tasks assigned to projects';
    END IF;
    
    IF rls_enabled < 3 THEN
        RAISE WARNING 'ISSUE: RLS not enabled on all required tables (% of 3)', rls_enabled;
    ELSE
        RAISE NOTICE 'SUCCESS: RLS enabled on all required tables';
    END IF;
    
    IF functions_count < 5 THEN
        RAISE WARNING 'ISSUE: Missing project helper functions (% of 5+)', functions_count;
    ELSE
        RAISE NOTICE 'SUCCESS: Project helper functions available';
    END IF;
    
    RAISE NOTICE '';
    
    -- Overall status
    IF orphaned_teams = 0 AND orphaned_tasks = 0 AND rls_enabled = 3 AND functions_count >= 5 THEN
        RAISE NOTICE '✅ MIGRATION STATUS: SUCCESS - All checks passed!';
    ELSE
        RAISE WARNING '❌ MIGRATION STATUS: ISSUES DETECTED - Review warnings above';
    END IF;
    
    RAISE NOTICE '========================================';
END $$;

-- Additional verification queries
\echo ''
\echo 'DETAILED VERIFICATION:'
\echo ''

\echo '1. Project Distribution:'
SELECT 
    w.name as workspace_name,
    COUNT(p.id) as project_count
FROM workspaces w
LEFT JOIN projects p ON w.id = p.workspace_id
GROUP BY w.id, w.name
ORDER BY w.name;

\echo ''
\echo '2. Project-Team-Task Relationships:'
SELECT 
    p.name as project_name,
    p.status,
    COUNT(DISTINCT t.id) as teams,
    COUNT(DISTINCT tk.id) as tasks,
    ROUND(
        CASE 
            WHEN COUNT(tk.id) > 0 
            THEN (COUNT(CASE WHEN tk.completed = true THEN 1 END) * 100.0 / COUNT(tk.id))
            ELSE 0 
        END, 1
    ) as completion_percent
FROM projects p
LEFT JOIN teams t ON p.id = t.project_id
LEFT JOIN tasks tk ON p.id = tk.project_id
GROUP BY p.id, p.name, p.status
ORDER BY p.created_at;

\echo ''
\echo '3. Default Projects Check:'
SELECT 
    w.name as workspace_name,
    p.name as default_project_name,
    p.settings->>'is_default' as is_default
FROM workspaces w
JOIN projects p ON w.id = p.workspace_id
WHERE p.settings->>'is_default' = 'true'
ORDER BY w.name;

\echo ''
\echo '4. RLS Policies Status:'
SELECT 
    schemaname,
    tablename,
    COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename IN ('projects', 'teams', 'tasks')
GROUP BY schemaname, tablename
ORDER BY tablename;

\echo ''
\echo '5. Helper Functions Available:'
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_name LIKE '%project%'
AND routine_schema = 'public'
ORDER BY routine_name;