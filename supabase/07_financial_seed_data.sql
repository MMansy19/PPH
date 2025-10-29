-- ============================================
-- Seed Data for Financial Management System
-- ============================================

-- Insert default transaction categories
INSERT INTO transaction_categories (name, type, description, color) VALUES
('Sales Revenue', 'income', 'Revenue from product/service sales', '#10b981'),
('Consulting Revenue', 'income', 'Revenue from consulting services', '#059669'),
('Investment Income', 'income', 'Returns from investments', '#047857'),
('Grant Funding', 'income', 'Government or private grants', '#065f46'),
('Other Income', 'income', 'Miscellaneous income sources', '#064e3b'),

('Office Rent', 'expense', 'Monthly office space rental', '#ef4444'),
('Utilities', 'expense', 'Electricity, water, internet bills', '#dc2626'),
('Marketing', 'expense', 'Advertising and promotional costs', '#b91c1c'),
('Software Subscriptions', 'expense', 'SaaS tools and software licenses', '#991b1b'),
('Travel & Transport', 'expense', 'Business travel and transportation', '#7f1d1d'),
('Office Supplies', 'expense', 'Stationery, equipment, furniture', '#fbbf24'),
('Professional Services', 'expense', 'Legal, accounting, consulting fees', '#f59e0b'),
('Training & Development', 'expense', 'Employee training and courses', '#d97706'),
('Insurance', 'expense', 'Business insurance premiums', '#b45309'),
('Equipment', 'expense', 'Computer hardware and equipment', '#92400e'),
('Meals & Entertainment', 'expense', 'Business meals and client entertainment', '#78350f'),
('Other Expenses', 'expense', 'Miscellaneous business expenses', '#451a03');

-- Insert sample departments
INSERT INTO departments (name, description, budget) VALUES
('Engineering', 'Software development and technical operations', 150000.00),
('Marketing', 'Marketing, advertising, and customer acquisition', 75000.00),
('Sales', 'Sales team and business development', 100000.00),
('Operations', 'General operations and administration', 50000.00),
('Finance', 'Financial management and accounting', 40000.00),
('Human Resources', 'HR and employee management', 30000.00);

-- Note: The following data would typically be inserted after users are created
-- This is example data structure - in practice, user_id would reference actual auth.users

-- Example financial transactions (these would need real user UUIDs)
/*
INSERT INTO financial_transactions (
    user_id, 
    department_id, 
    category_id, 
    title, 
    description, 
    amount, 
    type, 
    transaction_date,
    status
) VALUES
-- Sample income transactions
('user-uuid-1', 
 (SELECT id FROM departments WHERE name = 'Sales'), 
 (SELECT id FROM transaction_categories WHERE name = 'Sales Revenue'),
 'Q4 Software License Sales',
 'Enterprise software license sales for Q4',
 25000.00,
 'income',
 '2025-10-15',
 'completed'),

('user-uuid-2',
 (SELECT id FROM departments WHERE name = 'Sales'),
 (SELECT id FROM transaction_categories WHERE name = 'Consulting Revenue'),
 'Implementation Services',
 'Custom implementation for Enterprise client',
 15000.00,
 'income',
 '2025-10-20',
 'completed'),

-- Sample expense transactions
('user-uuid-3',
 (SELECT id FROM departments WHERE name = 'Operations'),
 (SELECT id FROM transaction_categories WHERE name = 'Office Rent'),
 'October Office Rent',
 'Monthly rent payment for main office',
 8000.00,
 'expense',
 '2025-10-01',
 'completed'),

('user-uuid-4',
 (SELECT id FROM departments WHERE name = 'Marketing'),
 (SELECT id FROM transaction_categories WHERE name = 'Marketing'),
 'Google Ads Campaign',
 'Q4 digital marketing campaign',
 3500.00,
 'expense',
 '2025-10-10',
 'completed'),

('user-uuid-5',
 (SELECT id FROM departments WHERE name = 'Engineering'),
 (SELECT id FROM transaction_categories WHERE name = 'Software Subscriptions'),
 'Development Tools',
 'Monthly subscriptions for development tools',
 2400.00,
 'expense',
 '2025-10-05',
 'completed');
*/

-- Insert sample budgets
INSERT INTO financial_budgets (
    department_id,
    category_id,
    name,
    budget_amount,
    start_date,
    end_date,
    status
) VALUES
-- Engineering department budgets
((SELECT id FROM departments WHERE name = 'Engineering'),
 (SELECT id FROM transaction_categories WHERE name = 'Software Subscriptions'),
 'Q4 Engineering Software Budget',
 15000.00,
 '2025-10-01',
 '2025-12-31',
 'active'),

((SELECT id FROM departments WHERE name = 'Engineering'),
 (SELECT id FROM transaction_categories WHERE name = 'Equipment'),
 'Q4 Engineering Equipment Budget',
 25000.00,
 '2025-10-01',
 '2025-12-31',
 'active'),

-- Marketing department budgets
((SELECT id FROM departments WHERE name = 'Marketing'),
 (SELECT id FROM transaction_categories WHERE name = 'Marketing'),
 'Q4 Marketing Campaign Budget',
 30000.00,
 '2025-10-01',
 '2025-12-31',
 'active'),

-- Operations department budgets
((SELECT id FROM departments WHERE name = 'Operations'),
 (SELECT id FROM transaction_categories WHERE name = 'Office Rent'),
 'Q4 Office Rent Budget',
 24000.00,
 '2025-10-01',
 '2025-12-31',
 'active'),

((SELECT id FROM departments WHERE name = 'Operations'),
 (SELECT id FROM transaction_categories WHERE name = 'Utilities'),
 'Q4 Utilities Budget',
 3000.00,
 '2025-10-01',
 '2025-12-31',
 'active');

-- Grant select permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions for views
GRANT SELECT ON monthly_financial_summary TO authenticated;
GRANT SELECT ON user_financial_overview TO authenticated;
GRANT SELECT ON department_budget_status TO authenticated;

-- Create a function to initialize financial data for new users
CREATE OR REPLACE FUNCTION initialize_user_financial_data(user_id UUID)
RETURNS void AS $$
BEGIN
    -- This function can be called when a new user is created
    -- to set up their initial financial data if needed
    
    -- Example: Create a default personal department for the user
    -- INSERT INTO departments (name, description, manager_id, budget)
    -- VALUES ('Personal', 'Personal financial tracking', user_id, 0);
    
    NULL; -- Placeholder for now
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- Function to get financial summary for a user
CREATE OR REPLACE FUNCTION get_user_financial_summary(
    target_user_id UUID DEFAULT auth.uid(),
    start_date DATE DEFAULT DATE_TRUNC('month', CURRENT_DATE)::DATE,
    end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    total_income DECIMAL(15,2),
    total_expenses DECIMAL(15,2),
    net_amount DECIMAL(15,2),
    transaction_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(CASE WHEN ft.type = 'income' THEN ft.amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN ft.type = 'expense' THEN ft.amount ELSE 0 END), 0) as total_expenses,
        COALESCE(SUM(CASE WHEN ft.type = 'income' THEN ft.amount ELSE -ft.amount END), 0) as net_amount,
        COUNT(*) as transaction_count
    FROM financial_transactions ft
    WHERE ft.user_id = target_user_id
    AND ft.transaction_date BETWEEN start_date AND end_date
    AND ft.status = 'completed';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get department financial summary
CREATE OR REPLACE FUNCTION get_department_financial_summary(
    target_department_id UUID,
    start_date DATE DEFAULT DATE_TRUNC('month', CURRENT_DATE)::DATE,
    end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    total_income DECIMAL(15,2),
    total_expenses DECIMAL(15,2),
    net_amount DECIMAL(15,2),
    transaction_count BIGINT,
    budget_amount DECIMAL(15,2),
    budget_remaining DECIMAL(15,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(CASE WHEN ft.type = 'income' THEN ft.amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN ft.type = 'expense' THEN ft.amount ELSE 0 END), 0) as total_expenses,
        COALESCE(SUM(CASE WHEN ft.type = 'income' THEN ft.amount ELSE -ft.amount END), 0) as net_amount,
        COUNT(*) as transaction_count,
        d.budget as budget_amount,
        d.budget - COALESCE(SUM(CASE WHEN ft.type = 'expense' THEN ft.amount ELSE 0 END), 0) as budget_remaining
    FROM departments d
    LEFT JOIN financial_transactions ft ON d.id = ft.department_id
        AND ft.transaction_date BETWEEN start_date AND end_date
        AND ft.status = 'completed'
    WHERE d.id = target_department_id
    GROUP BY d.id, d.budget;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;