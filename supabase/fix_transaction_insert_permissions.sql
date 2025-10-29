-- Fix for transaction creation "permission denied for table users" error
-- This addresses the specific issue with INSERT operations that include JOIN queries

-- The issue is that when inserting with a SELECT query that joins tables,
-- RLS policies might be checking permissions on joined tables in unexpected ways

-- 1. First, let's temporarily disable RLS on the foreign key tables to allow joins during INSERT
-- This is safe because we're still protecting the data through the main transaction table RLS

-- Temporarily allow all authenticated users to read departments and categories for joins
DROP POLICY IF EXISTS "Allow read access to departments" ON public.departments;
DROP POLICY IF EXISTS "Allow read access to categories" ON public.transaction_categories;

-- Create permissive read policies that don't reference other tables
CREATE POLICY "Public read access to departments" ON public.departments
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Public read access to categories" ON public.transaction_categories
    FOR SELECT TO authenticated
    USING (true);

-- 2. Ensure the financial_transactions RLS policy is simple and doesn't cause conflicts
DROP POLICY IF EXISTS "Allow full access to own transactions" ON public.financial_transactions;

-- Create separate policies for each operation to be more explicit
CREATE POLICY "Allow select own transactions" ON public.financial_transactions
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Allow insert transactions" ON public.financial_transactions
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow update own transactions" ON public.financial_transactions
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow delete own transactions" ON public.financial_transactions
    FOR DELETE TO authenticated
    USING (user_id = auth.uid());

-- 3. Check if RLS is properly enabled on all tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

-- 4. Verify the policies are working
SELECT 'RLS Policies for financial system:' as info;
SELECT schemaname, tablename, policyname, cmd, permissive
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('departments', 'transaction_categories', 'financial_transactions')
ORDER BY tablename, cmd;

-- 5. Test the fix with a simple query
-- This should work without permission errors
SELECT 'Test query - should work:' as test;
SELECT COUNT(*) as department_count FROM public.departments;
SELECT COUNT(*) as category_count FROM public.transaction_categories;
SELECT COUNT(*) as transaction_count FROM public.financial_transactions;