-- ========================================
-- ADD END_DATE COLUMN TO TASKS TABLE
-- Migration to fix task creation issue
-- ========================================
-- This migration adds the missing end_date column to the tasks table
-- Run this in Supabase SQL Editor

-- Add end_date column to tasks table
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE;

-- Create index for the new column for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_end_date ON tasks(end_date);

-- Update the table comment to reflect the new column
COMMENT ON COLUMN tasks.end_date IS 'Task end date (optional) - different from due_date which is deadline';

-- Optional: Update existing tasks that have a due_date but no end_date
-- This sets end_date = due_date for existing tasks where due_date exists
UPDATE tasks 
SET end_date = due_date 
WHERE due_date IS NOT NULL AND end_date IS NULL;

-- Verify the column was added successfully
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
AND column_name IN ('start_date', 'end_date', 'due_date')
ORDER BY column_name;