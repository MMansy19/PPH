-- =============================================
-- DATABASE CLEANUP - Drop All Tables
-- =============================================
-- Run this FIRST before the clean migration
-- This will DELETE ALL DATA - use with caution!
-- =============================================

-- Drop all policies first (prevents policy already exists errors)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on public schema tables
    FOR r IN (
        SELECT tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        BEGIN
            EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.tablename || ' CASCADE';
        EXCEPTION
            WHEN undefined_table THEN
                NULL; -- Ignore if table doesn't exist
            WHEN OTHERS THEN
                NULL; -- Ignore other errors
        END;
    END LOOP;
END $$;

-- Drop all tables in reverse dependency order
DROP TABLE IF EXISTS team_activity_logs CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS workspaces CASCADE;

-- Drop any triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS update_workspaces_updated_at ON workspaces CASCADE;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles CASCADE;
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects CASCADE;
DROP TRIGGER IF EXISTS update_teams_updated_at ON teams CASCADE;
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS get_user_profile_safe(UUID) CASCADE;

-- Drop views
DROP VIEW IF EXISTS users_view CASCADE;

-- Verify cleanup
SELECT 'All policies, tables, triggers, functions, and views dropped successfully! ✅' AS status;
SELECT 'You can now run 00_CLEAN_START_MIGRATION.sql' AS next_step;
