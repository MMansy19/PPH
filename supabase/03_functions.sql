-- ========================================
-- DATABASE FUNCTIONS & HELPERS
-- Project Portfolio Hub - Utility Functions
-- ========================================
-- Run this file AFTER 02_rls_policies.sql
-- Provides helper functions for common operations
-- ========================================

-- ========================================
-- 1. CREATE DEFAULT WORKSPACE ON USER SIGNUP
-- ========================================
-- Automatically creates a default workspace when user registers

CREATE OR REPLACE FUNCTION create_default_workspace()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, full_name, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NOW()
  );

  INSERT INTO workspaces (user_id, name, description, is_default, created_at)
  VALUES (
    NEW.id,
    'My First Workspace',
    'Your default portfolio workspace',
    TRUE,
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_workspace();

-- ========================================
-- 2. GET WORKSPACE STATISTICS
-- ========================================
-- Returns task counts and completion stats for a workspace

CREATE OR REPLACE FUNCTION get_workspace_stats(workspace_uuid UUID)
RETURNS TABLE (
  total_tasks BIGINT,
  completed_tasks BIGINT,
  high_priority_tasks BIGINT,
  overdue_tasks BIGINT,
  completion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total_tasks,
    COUNT(*) FILTER (WHERE completed = TRUE)::BIGINT AS completed_tasks,
    COUNT(*) FILTER (WHERE priority = 'high')::BIGINT AS high_priority_tasks,
    COUNT(*) FILTER (WHERE due_date < NOW() AND completed = FALSE)::BIGINT AS overdue_tasks,
    CASE
      WHEN COUNT(*) > 0 THEN
        ROUND((COUNT(*) FILTER (WHERE completed = TRUE)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
      ELSE 0
    END AS completion_rate
  FROM tasks
  WHERE workspace_id = workspace_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 3. LOG ACTIVITY FUNCTION
-- ========================================
-- Helper to log user actions

CREATE OR REPLACE FUNCTION log_activity(
  p_workspace_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO activity_logs (
    workspace_id,
    user_id,
    action,
    entity_type,
    entity_id,
    metadata
  )
  VALUES (
    p_workspace_id,
    auth.uid(),
    p_action,
    p_entity_type,
    p_entity_id,
    p_metadata
  )
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 4. GET USER'S DEFAULT WORKSPACE
-- ========================================
-- Returns the user's default workspace ID

CREATE OR REPLACE FUNCTION get_default_workspace()
RETURNS UUID AS $$
DECLARE
  v_workspace_id UUID;
BEGIN
  SELECT id INTO v_workspace_id
  FROM workspaces
  WHERE user_id = auth.uid()
  AND is_default = TRUE
  LIMIT 1;

  -- If no default, return first workspace
  IF v_workspace_id IS NULL THEN
    SELECT id INTO v_workspace_id
    FROM workspaces
    WHERE user_id = auth.uid()
    ORDER BY created_at ASC
    LIMIT 1;
  END IF;

  RETURN v_workspace_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 5. SET DEFAULT WORKSPACE
-- ========================================
-- Marks a workspace as default for the user

CREATE OR REPLACE FUNCTION set_default_workspace(workspace_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Remove default from all workspaces
  UPDATE workspaces
  SET is_default = FALSE
  WHERE user_id = auth.uid();

  -- Set new default
  UPDATE workspaces
  SET is_default = TRUE
  WHERE id = workspace_uuid
  AND user_id = auth.uid();

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 6. DUPLICATE TASK
-- ========================================
-- Creates a copy of a task

CREATE OR REPLACE FUNCTION duplicate_task(task_uuid UUID)
RETURNS UUID AS $$
DECLARE
  v_new_task_id UUID;
BEGIN
  INSERT INTO tasks (
    workspace_id,
    title,
    description,
    duration,
    priority,
    entity_type,
    value,
    risk,
    category,
    npv,
    tags
  )
  SELECT
    workspace_id,
    title || ' (Copy)',
    description,
    duration,
    priority,
    entity_type,
    value,
    risk,
    category,
    npv,
    tags
  FROM tasks
  WHERE id = task_uuid
  RETURNING id INTO v_new_task_id;

  RETURN v_new_task_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 7. ARCHIVE COMPLETED TASKS
-- ========================================
-- Soft delete completed tasks older than specified days

CREATE OR REPLACE FUNCTION archive_completed_tasks(
  workspace_uuid UUID,
  days_old INTEGER DEFAULT 30
)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  WITH deleted AS (
    DELETE FROM tasks
    WHERE workspace_id = workspace_uuid
    AND completed = TRUE
    AND updated_at < NOW() - INTERVAL '1 day' * days_old
    RETURNING *
  )
  SELECT COUNT(*) INTO v_count FROM deleted;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 8. GET PORTFOLIO INSIGHTS
-- ========================================
-- Returns aggregated portfolio metrics

CREATE OR REPLACE FUNCTION get_portfolio_insights(workspace_uuid UUID)
RETURNS TABLE (
  category TEXT,
  task_count BIGINT,
  avg_value NUMERIC,
  avg_risk NUMERIC,
  total_npv NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.category,
    COUNT(*)::BIGINT AS task_count,
    ROUND(AVG(t.value), 2) AS avg_value,
    ROUND(AVG(t.risk), 2) AS avg_risk,
    ROUND(SUM(t.npv), 2) AS total_npv
  FROM tasks t
  WHERE t.workspace_id = workspace_uuid
  AND t.category IS NOT NULL
  GROUP BY t.category
  ORDER BY task_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- SUCCESS MESSAGE
-- ========================================
DO $$
BEGIN
  RAISE NOTICE 'Database functions created successfully! ✅';
  RAISE NOTICE 'Next step: Run 04_seed_data.sql (optional for testing)';
END $$;
