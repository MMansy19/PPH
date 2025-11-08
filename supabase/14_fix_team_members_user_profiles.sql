-- ========================================
-- FIX: Team Members and User Profiles Relationship
-- PPH - Personal Process Hub
-- Run this to fix the missing foreign key relationship
-- ========================================

BEGIN;

-- ========================================
-- 1. ENSURE USER_PROFILES TABLE EXISTS AND IS PROPERLY STRUCTURED
-- ========================================

-- Create user_profiles table if it doesn't exist (it should exist from 01_schema.sql)
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns if they don't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS username TEXT,
ADD COLUMN IF NOT EXISTS username_updated_at TIMESTAMP WITH TIME ZONE;

-- ========================================
-- 2. ENSURE PROPER INDEXES EXIST
-- ========================================

-- Create indexes for user_profiles if they don't exist
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_username_unique ON user_profiles(LOWER(username));

-- ========================================
-- 3. VERIFY TEAM_MEMBERS TABLE STRUCTURE
-- ========================================

-- Ensure team_members table has the correct structure
-- The user_id column should reference auth.users(id), not user_profiles(id)
-- This is correct because user_profiles.id also references auth.users(id)

-- Check if the foreign key constraint exists and is correct
DO $$
BEGIN
  -- Check if team_members table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'team_members' AND table_schema = 'public') THEN
    -- If team_members exists, make sure it has proper foreign key to auth.users
    -- The constraint should already be correct from the team collaboration migration
    
    -- Verify the constraint exists
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints tc
      WHERE tc.table_name = 'team_members' 
      AND tc.constraint_type = 'FOREIGN KEY'
      AND tc.constraint_name = 'fk_team_members_user_id'
    ) THEN
      -- Add the foreign key constraint if it's missing
      -- Only add if the constraint doesn't exist
      BEGIN
        ALTER TABLE team_members 
        ADD CONSTRAINT fk_team_members_user_id 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN
          NULL; -- Ignore if constraint already exists
      END;
    END IF;
  END IF;
END $$;

-- ========================================
-- 4. CREATE HELPER VIEW FOR USER DATA
-- ========================================

-- Create a view that combines auth.users with user_profiles
-- This can be used as an alternative to direct joins
DROP VIEW IF EXISTS users_view;
CREATE VIEW users_view AS
SELECT 
  u.id,
  u.email,
  u.created_at as user_created_at,
  u.updated_at as user_updated_at,
  up.full_name,
  up.username,
  up.avatar_url,
  up.company,
  up.role,
  up.preferences,
  up.created_at as profile_created_at,
  up.updated_at as profile_updated_at
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.id;

-- Grant permissions to the view
GRANT SELECT ON users_view TO authenticated;

-- ========================================
-- 5. CREATE FUNCTION TO SAFELY GET USER PROFILE DATA
-- ========================================

-- Function to get user profile data with fallback
CREATE OR REPLACE FUNCTION get_user_profile_safe(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  company TEXT,
  email TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    COALESCE(up.username, split_part(u.email, '@', 1)) as username,
    COALESCE(up.full_name, split_part(u.email, '@', 1)) as full_name,
    up.avatar_url,
    up.company,
    u.email
  FROM auth.users u
  LEFT JOIN user_profiles up ON u.id = up.id
  WHERE u.id = user_uuid;
END;
$$;

-- ========================================
-- 6. ENSURE ALL USERS HAVE PROFILE RECORDS
-- ========================================

-- Insert missing user profile records for existing users
INSERT INTO user_profiles (id, full_name, username, created_at, updated_at)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) as full_name,
  LOWER(REGEXP_REPLACE(split_part(u.email, '@', 1), '[^a-zA-Z0-9_]', '_', 'g')) as username,
  NOW(),
  NOW()
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_profiles up WHERE up.id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 7. ADD HELPFUL INDEXES FOR PERFORMANCE
-- ========================================

-- Add indexes that might be missing
CREATE INDEX IF NOT EXISTS idx_team_members_team_user ON team_members(team_id, user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_id ON user_profiles(id);

-- ========================================
-- 8. ENABLE RLS ON USER_PROFILES IF NOT ALREADY ENABLED
-- ========================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create or update user_profiles RLS policy
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Also allow viewing profiles of team members (for team functionality)
DROP POLICY IF EXISTS "Users can view team member profiles" ON user_profiles;
CREATE POLICY "Users can view team member profiles"
  ON user_profiles FOR SELECT
  USING (
    -- Can view own profile
    auth.uid() = id
    OR
    -- Can view profiles of users in same teams
    id IN (
      SELECT tm2.user_id
      FROM team_members tm1
      JOIN team_members tm2 ON tm1.team_id = tm2.team_id
      WHERE tm1.user_id = auth.uid()
    )
    OR
    -- Can view profiles in workspaces they own
    id IN (
      SELECT tm.user_id
      FROM team_members tm
      JOIN teams t ON tm.team_id = t.id
      JOIN projects p ON t.project_id = p.id
      JOIN workspaces w ON p.workspace_id = w.id
      WHERE w.user_id = auth.uid()
    )
  );

COMMIT;

-- ========================================
-- SUCCESS MESSAGE
-- ========================================
DO $$
BEGIN
  RAISE NOTICE 'Team Members and User Profiles relationship fixed! ✅';
  RAISE NOTICE 'You can now create projects and fetch team data properly.';
  RAISE NOTICE 'The system will use the user_profiles table for user data.';
END $$;