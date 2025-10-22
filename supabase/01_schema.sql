-- ========================================
-- SUPABASE SCHEMA SETUP
-- Project Portfolio Hub - Database Tables
-- ========================================
-- Run this file first in Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste & Run
-- ========================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. WORKSPACES TABLE
-- ========================================
-- Store user workspaces (projects/portfolios)
-- Each user can have multiple workspaces

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

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_workspaces_user_id ON workspaces(user_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_created_at ON workspaces(created_at);

-- ========================================
-- 2. TASKS TABLE
-- ========================================
-- Store tasks/projects with portfolio attributes

CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  entity_type TEXT CHECK (entity_type IN ('task', 'event', 'activity', 'process')) DEFAULT 'task',
  completed BOOLEAN DEFAULT FALSE,
  
  -- Chain/dependency tracking
  chain_id TEXT,
  
  -- Position for board view
  x NUMERIC,
  y NUMERIC,
  
  -- Portfolio bubble chart attributes
  value NUMERIC CHECK (value >= 1 AND value <= 10),  -- Strategic value (1-10)
  risk NUMERIC CHECK (risk >= 1 AND risk <= 10),     -- Risk level (1-10)
  category TEXT CHECK (category IN ('big_bets', 'line_extensions', 'ltos', 'other')),
  npv NUMERIC,  -- Net Present Value (millions) - bubble size
  
  -- Calendar/date tracking
  due_date TIMESTAMP WITH TIME ZONE,
  start_date TIMESTAMP WITH TIME ZONE,
  
  -- Additional metadata
  tags TEXT[],
  assignee TEXT,
  status TEXT DEFAULT 'todo',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_workspace_id ON tasks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

-- ========================================
-- 3. USER PROFILES TABLE (OPTIONAL)
-- ========================================
-- Store additional user metadata

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  company TEXT,
  role TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 4. ACTIVITY LOGS TABLE (OPTIONAL)
-- ========================================
-- Track user actions for audit trail

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,  -- 'created', 'updated', 'deleted', 'completed'
  entity_type TEXT,      -- 'task', 'workspace'
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_workspace_id ON activity_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

-- ========================================
-- 5. UPDATED_AT TRIGGER FUNCTION
-- ========================================
-- Auto-update updated_at timestamp

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- SUCCESS MESSAGE
-- ========================================
-- If you see this, schema creation was successful!
DO $$
BEGIN
  RAISE NOTICE 'Schema created successfully! ✅';
  RAISE NOTICE 'Next step: Run 02_rls_policies.sql';
END $$;
