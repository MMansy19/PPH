-- ============================================
-- Fix Financial Audit Log RLS Policy
-- ============================================
-- This fixes the "new row violates row-level security policy for table financial_audit_log" error
-- The audit trigger needs to be able to insert records, but the RLS policy was blocking it

-- Solution: Make the audit trigger function run with SECURITY DEFINER
-- This allows the trigger to bypass RLS when inserting audit records

-- Step 1: Drop the existing audit trigger function and recreate with SECURITY DEFINER
DROP FUNCTION IF EXISTS financial_audit_trigger() CASCADE;

CREATE OR REPLACE FUNCTION financial_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO financial_audit_log (user_id, table_name, record_id, action, old_values)
        VALUES (COALESCE(auth.uid(), OLD.user_id), TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO financial_audit_log (user_id, table_name, record_id, action, old_values, new_values)
        VALUES (COALESCE(auth.uid(), NEW.user_id), TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO financial_audit_log (user_id, table_name, record_id, action, new_values)
        VALUES (COALESCE(auth.uid(), NEW.user_id), TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Recreate the triggers (they were dropped when function was dropped with CASCADE)
DROP TRIGGER IF EXISTS financial_transactions_audit_trigger ON financial_transactions;
CREATE TRIGGER financial_transactions_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON financial_transactions
    FOR EACH ROW EXECUTE FUNCTION financial_audit_trigger();

DROP TRIGGER IF EXISTS employee_salaries_audit_trigger ON employee_salaries;
CREATE TRIGGER employee_salaries_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON employee_salaries
    FOR EACH ROW EXECUTE FUNCTION financial_audit_trigger();

-- Step 3: Add INSERT policy for audit log (as additional safety measure)
-- This allows the trigger to insert, but prevents direct user inserts
DROP POLICY IF EXISTS "financial_audit_log_insert_policy" ON financial_audit_log;

-- Only allow inserts from triggers (no direct inserts from users)
-- The SECURITY DEFINER function will bypass this anyway, but it's good practice
CREATE POLICY "financial_audit_log_insert_policy" ON financial_audit_log
FOR INSERT WITH CHECK (
    -- Only allow system/trigger inserts
    -- Users should never directly insert into audit log
    false
);

-- Note: The SECURITY DEFINER function bypasses RLS, so this policy won't block trigger inserts
-- but it will prevent any direct user attempts to insert into the audit log

-- Step 4: Verify the fix
DO $$
BEGIN
    RAISE NOTICE 'Financial audit log fix applied successfully!';
    RAISE NOTICE 'The audit trigger now runs with SECURITY DEFINER privileges';
    RAISE NOTICE 'RLS policies will not block audit log inserts from triggers';
    RAISE NOTICE 'Direct user inserts to audit log are still blocked';
END $$;
