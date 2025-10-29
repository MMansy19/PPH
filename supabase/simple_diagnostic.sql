    -- Simplified diagnostic script for Supabase
    -- Run this to check current state before applying fixes

    -- 1. Check data counts
    SELECT 'Data Counts:' as check_type, 'departments' as table_name, COUNT(*) as count FROM public.departments
    UNION ALL
    SELECT 'Data Counts:', 'transaction_categories', COUNT(*) FROM public.transaction_categories  
    UNION ALL
    SELECT 'Data Counts:', 'financial_transactions', COUNT(*) FROM public.financial_transactions;

    -- 2. Check for duplicates in departments
    SELECT 'Duplicate Check:' as check_type, 'departments' as table_name, name, COUNT(*) as duplicate_count
    FROM public.departments 
    GROUP BY name 
    HAVING COUNT(*) > 1;

    -- 3. Check for duplicates in categories  
    SELECT 'Duplicate Check:' as check_type, 'transaction_categories' as table_name, name || ' (' || type || ')' as name, COUNT(*) as duplicate_count
    FROM public.transaction_categories 
    GROUP BY name, type 
    HAVING COUNT(*) > 1;

    -- 4. Check RLS policies (simplified)
    SELECT 'RLS Policies:' as check_type, tablename as table_name, policyname as policy_name, cmd as command
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename IN ('departments', 'transaction_categories', 'financial_transactions');

    -- 5. Test basic access to tables
    SELECT 'Access Test:' as check_type, 'departments' as table_name, 'SUCCESS' as status
    FROM public.departments LIMIT 1;

    SELECT 'Access Test:' as check_type, 'transaction_categories' as table_name, 'SUCCESS' as status  
    FROM public.transaction_categories LIMIT 1;

    SELECT 'Access Test:' as check_type, 'financial_transactions' as table_name, 'SUCCESS' as status
    FROM public.financial_transactions LIMIT 1;