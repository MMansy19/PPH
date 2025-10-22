-- ========================================
-- SEED DATA (OPTIONAL - FOR TESTING)
-- Project Portfolio Hub - Sample Data
-- ========================================
-- Run this file AFTER 03_functions.sql
-- ONLY USE FOR DEVELOPMENT/TESTING
-- ========================================
-- This will create sample data for the authenticated user
-- Make sure you're logged in before running this
-- ========================================

-- ========================================
-- NOTE: SKIP THIS FILE FOR PRODUCTION
-- ========================================
-- This is only for testing purposes
-- In production, data will be created through the UI

-- ========================================
-- 1. CREATE SAMPLE WORKSPACES
-- ========================================
-- Uncomment and run ONLY if you want sample data


DO $$
DECLARE
  v_user_id UUID;
  v_workspace1_id UUID;
  v_workspace2_id UUID;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No authenticated user found. Please log in first.';
  END IF;

  -- Create first workspace (if not exists)
  INSERT INTO workspaces (user_id, name, description, theme_color, icon, is_default)
  VALUES (
    v_user_id,
    'Product Portfolio 2025',
    'Annual product portfolio planning and management',
    '#3B82F6',
    '📊',
    TRUE
  )
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_workspace1_id;

  -- Create second workspace
  INSERT INTO workspaces (user_id, name, description, theme_color, icon, is_default)
  VALUES (
    v_user_id,
    'Innovation Lab',
    'R&D and experimental projects',
    '#10B981',
    '🧪',
    FALSE
  )
  ON CONFLICT DO NOTHING
  RETURNING id INTO v_workspace2_id;

  RAISE NOTICE 'Sample workspaces created! ✅';
  RAISE NOTICE 'Workspace 1 ID: %', v_workspace1_id;
  RAISE NOTICE 'Workspace 2 ID: %', v_workspace2_id;
END $$;

-- ========================================
-- 2. CREATE SAMPLE TASKS
-- ========================================
-- Uncomment to add sample tasks to your workspaces


DO $$
DECLARE
  v_workspace_id UUID;
BEGIN
  -- Get first workspace
  SELECT id INTO v_workspace_id
  FROM workspaces
  WHERE user_id = auth.uid()
  ORDER BY created_at ASC
  LIMIT 1;

  IF v_workspace_id IS NULL THEN
    RAISE EXCEPTION 'No workspace found. Create a workspace first.';
  END IF;

  -- Insert Big Bets
  INSERT INTO tasks (
    workspace_id, title, description, priority, entity_type,
    category, value, risk, npv, duration, completed
  ) VALUES
  (
    v_workspace_id,
    'Next-Gen AI Platform',
    'Revolutionary AI-powered platform for enterprise customers',
    'high',
    'task',
    'big_bets',
    9,
    8,
    150.5,
    '12 months',
    FALSE
  ),
  (
    v_workspace_id,
    'Quantum Computing Initiative',
    'Research and development in quantum computing applications',
    'high',
    'process',
    'big_bets',
    10,
    9,
    250.0,
    '24 months',
    FALSE
  );

  -- Insert Line Extensions
  INSERT INTO tasks (
    workspace_id, title, description, priority, entity_type,
    category, value, risk, npv, duration, completed
  ) VALUES
  (
    v_workspace_id,
    'Mobile App v2.0',
    'Enhanced mobile experience with new features',
    'medium',
    'task',
    'line_extensions',
    7,
    4,
    45.0,
    '6 months',
    FALSE
  ),
  (
    v_workspace_id,
    'Premium Tier Launch',
    'New premium subscription tier with advanced features',
    'high',
    'event',
    'line_extensions',
    8,
    3,
    75.5,
    '4 months',
    FALSE
  );

  -- Insert LTOs (Limited Time Offers)
  INSERT INTO tasks (
    workspace_id, title, description, priority, entity_type,
    category, value, risk, npv, duration, completed
  ) VALUES
  (
    v_workspace_id,
    'Holiday Campaign 2025',
    'Special holiday promotion and marketing campaign',
    'medium',
    'activity',
    'ltos',
    6,
    2,
    15.0,
    '2 months',
    FALSE
  ),
  (
    v_workspace_id,
    'Flash Sale Integration',
    'Quick wins through flash sale promotions',
    'low',
    'activity',
    'ltos',
    5,
    2,
    8.5,
    '1 month',
    TRUE
  );

  -- Insert Other Tasks
  INSERT INTO tasks (
    workspace_id, title, description, priority, entity_type,
    category, value, risk, npv, duration, completed, due_date
  ) VALUES
  (
    v_workspace_id,
    'Security Audit Q1',
    'Comprehensive security review and penetration testing',
    'high',
    'task',
    'other',
    7,
    5,
    NULL,
    '3 weeks',
    FALSE,
    NOW() + INTERVAL '30 days'
  ),
  (
    v_workspace_id,
    'Team Onboarding Process',
    'Streamline new hire onboarding procedures',
    'low',
    'process',
    'other',
    4,
    1,
    NULL,
    '2 weeks',
    FALSE,
    NOW() + INTERVAL '14 days'
  );

  RAISE NOTICE 'Sample tasks created! ✅';
  RAISE NOTICE 'Check your workspace for the new tasks';
END $$;


-- ========================================
-- 3. TEST FUNCTIONS (OPTIONAL)
-- ========================================
-- Uncomment to test database functions


DO $$
DECLARE
  v_workspace_id UUID;
  v_stats RECORD;
  v_insights RECORD;
BEGIN
  -- Get first workspace
  SELECT id INTO v_workspace_id FROM workspaces WHERE user_id = auth.uid() LIMIT 1;

  -- Test workspace stats
  SELECT * INTO v_stats FROM get_workspace_stats(v_workspace_id);
  RAISE NOTICE 'Workspace Stats:';
  RAISE NOTICE 'Total Tasks: %', v_stats.total_tasks;
  RAISE NOTICE 'Completed: %', v_stats.completed_tasks;
  RAISE NOTICE 'Completion Rate: %%%', v_stats.completion_rate;

  -- Test portfolio insights
  RAISE NOTICE 'Portfolio Insights:';
  FOR v_insights IN SELECT * FROM get_portfolio_insights(v_workspace_id) LOOP
    RAISE NOTICE 'Category: %, Count: %, Avg Value: %, Total NPV: %',
      v_insights.category,
      v_insights.task_count,
      v_insights.avg_value,
      v_insights.total_npv;
  END LOOP;
END $$;

-- ========================================
-- SUCCESS MESSAGE
-- ========================================
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Seed data file loaded! ℹ️';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'This file contains OPTIONAL sample data';
  RAISE NOTICE 'Uncomment the sections to use them';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Setup Complete! All SQL files ready ✅';
  RAISE NOTICE '========================================';
END $$;
