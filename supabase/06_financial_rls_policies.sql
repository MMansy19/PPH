-- ============================================
-- Row Level Security Policies for Financial Management System
-- ============================================

-- Enable RLS on all tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_budgets ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DEPARTMENTS POLICIES
-- ============================================

-- Managers and admins can see all departments, users can see their own department
CREATE POLICY "departments_select_policy" ON departments
FOR SELECT USING (
    auth.uid() = manager_id OR
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' IN ('admin', 'manager')
    )
);

-- Only admins and managers can insert departments
CREATE POLICY "departments_insert_policy" ON departments
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' IN ('admin', 'manager')
    )
);

-- Managers can update their own departments, admins can update all
CREATE POLICY "departments_update_policy" ON departments
FOR UPDATE USING (
    auth.uid() = manager_id OR
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' = 'admin'
    )
);

-- Only admins can delete departments
CREATE POLICY "departments_delete_policy" ON departments
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' = 'admin'
    )
);

-- ============================================
-- TRANSACTION CATEGORIES POLICIES
-- ============================================

-- Everyone can read categories
CREATE POLICY "transaction_categories_select_policy" ON transaction_categories
FOR SELECT USING (true);

-- Only admins and managers can manage categories
CREATE POLICY "transaction_categories_insert_policy" ON transaction_categories
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' IN ('admin', 'manager')
    )
);

CREATE POLICY "transaction_categories_update_policy" ON transaction_categories
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' IN ('admin', 'manager')
    )
);

CREATE POLICY "transaction_categories_delete_policy" ON transaction_categories
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' = 'admin'
    )
);

-- ============================================
-- FINANCIAL TRANSACTIONS POLICIES
-- ============================================

-- Users can see their own transactions, managers can see their department's, admins see all
CREATE POLICY "financial_transactions_select_policy" ON financial_transactions
FOR SELECT USING (
    auth.uid() = user_id OR
    auth.uid() = created_by OR
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' = 'admin'
    ) OR
    EXISTS (
        SELECT 1 FROM departments d
        WHERE d.id = financial_transactions.department_id
        AND d.manager_id = auth.uid()
    )
);

-- Users can insert transactions for themselves, managers for their department
CREATE POLICY "financial_transactions_insert_policy" ON financial_transactions
FOR INSERT WITH CHECK (
    auth.uid() = user_id OR
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' IN ('admin', 'manager')
    )
);

-- Users can update their own transactions, managers their department's, admins all
CREATE POLICY "financial_transactions_update_policy" ON financial_transactions
FOR UPDATE USING (
    auth.uid() = user_id OR
    auth.uid() = created_by OR
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' = 'admin'
    ) OR
    EXISTS (
        SELECT 1 FROM departments d
        WHERE d.id = financial_transactions.department_id
        AND d.manager_id = auth.uid()
    )
);

-- Same rules for delete
CREATE POLICY "financial_transactions_delete_policy" ON financial_transactions
FOR DELETE USING (
    auth.uid() = user_id OR
    auth.uid() = created_by OR
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' = 'admin'
    ) OR
    EXISTS (
        SELECT 1 FROM departments d
        WHERE d.id = financial_transactions.department_id
        AND d.manager_id = auth.uid()
    )
);

-- ============================================
-- EMPLOYEE SALARIES POLICIES
-- ============================================

-- Users can see their own salaries, managers their department's, admins all
CREATE POLICY "employee_salaries_select_policy" ON employee_salaries
FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' = 'admin'
    ) OR
    EXISTS (
        SELECT 1 FROM departments d
        WHERE d.id = employee_salaries.department_id
        AND d.manager_id = auth.uid()
    )
);

-- Only managers and admins can manage salaries
CREATE POLICY "employee_salaries_insert_policy" ON employee_salaries
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' IN ('admin', 'manager')
    )
);

CREATE POLICY "employee_salaries_update_policy" ON employee_salaries
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' = 'admin'
    ) OR
    EXISTS (
        SELECT 1 FROM departments d
        WHERE d.id = employee_salaries.department_id
        AND d.manager_id = auth.uid()
    )
);

CREATE POLICY "employee_salaries_delete_policy" ON employee_salaries
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' = 'admin'
    )
);

-- ============================================
-- TRANSACTION COMMENTS POLICIES
-- ============================================

-- Users can see comments on transactions they can see
CREATE POLICY "transaction_comments_select_policy" ON transaction_comments
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM financial_transactions ft
        WHERE ft.id = transaction_comments.transaction_id
        AND (
            ft.user_id = auth.uid() OR
            ft.created_by = auth.uid() OR
            EXISTS (
                SELECT 1 FROM auth.users 
                WHERE id = auth.uid() 
                AND raw_user_meta_data->>'role' = 'admin'
            ) OR
            EXISTS (
                SELECT 1 FROM departments d
                WHERE d.id = ft.department_id
                AND d.manager_id = auth.uid()
            )
        )
    )
);

-- Users can add comments to transactions they can see
CREATE POLICY "transaction_comments_insert_policy" ON transaction_comments
FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM financial_transactions ft
        WHERE ft.id = transaction_comments.transaction_id
        AND (
            ft.user_id = auth.uid() OR
            ft.created_by = auth.uid() OR
            EXISTS (
                SELECT 1 FROM auth.users 
                WHERE id = auth.uid() 
                AND raw_user_meta_data->>'role' = 'admin'
            ) OR
            EXISTS (
                SELECT 1 FROM departments d
                WHERE d.id = ft.department_id
                AND d.manager_id = auth.uid()
            )
        )
    )
);

-- Users can update their own comments
CREATE POLICY "transaction_comments_update_policy" ON transaction_comments
FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own comments, admins can delete any
CREATE POLICY "transaction_comments_delete_policy" ON transaction_comments
FOR DELETE USING (
    auth.uid() = user_id OR
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' = 'admin'
    )
);

-- ============================================
-- FINANCIAL AUDIT LOG POLICIES
-- ============================================

-- Only admins can read audit logs
CREATE POLICY "financial_audit_log_select_policy" ON financial_audit_log
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' = 'admin'
    )
);

-- Audit log entries are created by triggers, no direct insert/update/delete allowed

-- ============================================
-- FINANCIAL BUDGETS POLICIES
-- ============================================

-- Users can see budgets for their department, managers for their departments, admins see all
CREATE POLICY "financial_budgets_select_policy" ON financial_budgets
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' = 'admin'
    ) OR
    EXISTS (
        SELECT 1 FROM departments d
        WHERE d.id = financial_budgets.department_id
        AND d.manager_id = auth.uid()
    )
);

-- Only managers and admins can manage budgets
CREATE POLICY "financial_budgets_insert_policy" ON financial_budgets
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' IN ('admin', 'manager')
    )
);

CREATE POLICY "financial_budgets_update_policy" ON financial_budgets
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' = 'admin'
    ) OR
    EXISTS (
        SELECT 1 FROM departments d
        WHERE d.id = financial_budgets.department_id
        AND d.manager_id = auth.uid()
    )
);

CREATE POLICY "financial_budgets_delete_policy" ON financial_budgets
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' = 'admin'
    )
);

-- ============================================
-- HELPER FUNCTIONS for RLS
-- ============================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is manager
CREATE OR REPLACE FUNCTION is_manager()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'role' IN ('admin', 'manager')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's managed departments
CREATE OR REPLACE FUNCTION get_managed_departments()
RETURNS TABLE(department_id UUID) AS $$
BEGIN
    RETURN QUERY
    SELECT d.id FROM departments d
    WHERE d.manager_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;