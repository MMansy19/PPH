-- ============================================
-- Insert Sample Categories and Departments
-- Run this after setting up the financial schema
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
('Other Expenses', 'expense', 'Miscellaneous business expenses', '#451a03')
ON CONFLICT (name) DO NOTHING;

-- Insert sample departments
INSERT INTO departments (name, description, budget) VALUES
('Engineering', 'Software development and technical operations', 150000.00),
('Marketing', 'Marketing, advertising, and customer acquisition', 75000.00),
('Sales', 'Sales team and business development', 100000.00),
('Operations', 'General operations and administration', 50000.00),
('Finance', 'Financial management and accounting', 40000.00),
('Human Resources', 'HR and employee management', 30000.00)
ON CONFLICT (name) DO NOTHING;