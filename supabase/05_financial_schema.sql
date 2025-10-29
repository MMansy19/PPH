-- ============================================
-- Financial Management System Schema
-- Economic Input/Output Management System
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Departments table for organizing financial data
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    manager_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    budget DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Transaction categories for better organization
CREATE TABLE transaction_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense', 'both')),
    description TEXT,
    color VARCHAR(7) DEFAULT '#6366f1', -- Hex color for UI
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Financial transactions table (main data)
CREATE TABLE financial_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    category_id UUID REFERENCES transaction_categories(id) ON DELETE SET NULL,
    
    -- Transaction details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(15,2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
    
    -- Dates
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    
    -- Additional fields
    reference_number VARCHAR(100),
    receipt_url TEXT,
    tags TEXT[], -- Array of tags for flexible categorization
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Salary and payroll management
CREATE TABLE employee_salaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    
    -- Salary details
    base_salary DECIMAL(15,2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    pay_frequency VARCHAR(20) DEFAULT 'monthly' CHECK (pay_frequency IN ('weekly', 'bi-weekly', 'monthly', 'quarterly', 'yearly')),
    
    -- Additional compensation
    bonuses DECIMAL(15,2) DEFAULT 0,
    commissions DECIMAL(15,2) DEFAULT 0,
    deductions DECIMAL(15,2) DEFAULT 0,
    
    -- Period
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    payment_date DATE,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
    
    -- Calculated total
    total_amount DECIMAL(15,2) GENERATED ALWAYS AS (base_salary + bonuses + commissions - deductions) STORED,
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Comments system for transactions
CREATE TABLE transaction_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES financial_transactions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Audit log for tracking changes
CREATE TABLE financial_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    table_name VARCHAR(255) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Financial budgets and targets
CREATE TABLE financial_budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    category_id UUID REFERENCES transaction_categories(id) ON DELETE CASCADE,
    
    -- Budget details
    name VARCHAR(255) NOT NULL,
    budget_amount DECIMAL(15,2) NOT NULL,
    spent_amount DECIMAL(15,2) DEFAULT 0,
    remaining_amount DECIMAL(15,2) GENERATED ALWAYS AS (budget_amount - spent_amount) STORED,
    
    -- Period
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'suspended')),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ============================================
-- INDEXES for better performance
-- ============================================

CREATE INDEX idx_financial_transactions_user_id ON financial_transactions(user_id);
CREATE INDEX idx_financial_transactions_department_id ON financial_transactions(department_id);
CREATE INDEX idx_financial_transactions_category_id ON financial_transactions(category_id);
CREATE INDEX idx_financial_transactions_type ON financial_transactions(type);
CREATE INDEX idx_financial_transactions_date ON financial_transactions(transaction_date);
CREATE INDEX idx_financial_transactions_status ON financial_transactions(status);

CREATE INDEX idx_employee_salaries_user_id ON employee_salaries(user_id);
CREATE INDEX idx_employee_salaries_department_id ON employee_salaries(department_id);
CREATE INDEX idx_employee_salaries_period ON employee_salaries(pay_period_start, pay_period_end);

CREATE INDEX idx_transaction_comments_transaction_id ON transaction_comments(transaction_id);
CREATE INDEX idx_transaction_comments_user_id ON transaction_comments(user_id);

CREATE INDEX idx_financial_audit_log_table_record ON financial_audit_log(table_name, record_id);
CREATE INDEX idx_financial_audit_log_user_id ON financial_audit_log(user_id);

-- ============================================
-- FUNCTIONS for automatic updates
-- ============================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updating timestamps
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transaction_categories_updated_at BEFORE UPDATE ON transaction_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_transactions_updated_at BEFORE UPDATE ON financial_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employee_salaries_updated_at BEFORE UPDATE ON employee_salaries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transaction_comments_updated_at BEFORE UPDATE ON transaction_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_budgets_updated_at BEFORE UPDATE ON financial_budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- AUDIT TRIGGER FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION financial_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO financial_audit_log (user_id, table_name, record_id, action, old_values)
        VALUES (COALESCE(current_setting('app.current_user_id', true)::UUID, OLD.user_id), TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO financial_audit_log (user_id, table_name, record_id, action, old_values, new_values)
        VALUES (COALESCE(current_setting('app.current_user_id', true)::UUID, NEW.user_id), TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO financial_audit_log (user_id, table_name, record_id, action, new_values)
        VALUES (COALESCE(current_setting('app.current_user_id', true)::UUID, NEW.user_id), TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to main tables
CREATE TRIGGER financial_transactions_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON financial_transactions
    FOR EACH ROW EXECUTE FUNCTION financial_audit_trigger();

CREATE TRIGGER employee_salaries_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON employee_salaries
    FOR EACH ROW EXECUTE FUNCTION financial_audit_trigger();

-- ============================================
-- VIEWS for common queries
-- ============================================

-- Monthly financial summary view
CREATE VIEW monthly_financial_summary AS
SELECT 
    DATE_TRUNC('month', transaction_date) as month,
    type,
    department_id,
    SUM(amount) as total_amount,
    COUNT(*) as transaction_count,
    AVG(amount) as average_amount
FROM financial_transactions 
WHERE status = 'completed'
GROUP BY DATE_TRUNC('month', transaction_date), type, department_id
ORDER BY month DESC;

-- User financial overview
CREATE VIEW user_financial_overview AS
SELECT 
    ft.user_id,
    SUM(CASE WHEN ft.type = 'income' THEN ft.amount ELSE 0 END) as total_income,
    SUM(CASE WHEN ft.type = 'expense' THEN ft.amount ELSE 0 END) as total_expenses,
    SUM(CASE WHEN ft.type = 'income' THEN ft.amount ELSE -ft.amount END) as net_amount,
    COUNT(*) as total_transactions
FROM financial_transactions ft
WHERE ft.status = 'completed'
GROUP BY ft.user_id;

-- Department budget status
CREATE VIEW department_budget_status AS
SELECT 
    d.id as department_id,
    d.name as department_name,
    d.budget as allocated_budget,
    COALESCE(SUM(CASE WHEN ft.type = 'expense' THEN ft.amount ELSE 0 END), 0) as spent_amount,
    d.budget - COALESCE(SUM(CASE WHEN ft.type = 'expense' THEN ft.amount ELSE 0 END), 0) as remaining_budget,
    CASE 
        WHEN d.budget > 0 THEN (COALESCE(SUM(CASE WHEN ft.type = 'expense' THEN ft.amount ELSE 0 END), 0) / d.budget * 100)
        ELSE 0 
    END as budget_utilization_percentage
FROM departments d
LEFT JOIN financial_transactions ft ON d.id = ft.department_id AND ft.status = 'completed'
GROUP BY d.id, d.name, d.budget;