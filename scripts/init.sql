-- PostgreSQL initialization script for Suplementor development database

-- Create development user and database
CREATE DATABASE suplementor_dev;
GRANT ALL PRIVILEGES ON DATABASE suplementor_dev TO suplementor;

-- Connect to the new database
\c suplementor_dev;

-- Create extensions for medical app
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create development user profile table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create supplement tracking table
CREATE TABLE IF NOT EXISTS supplement_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    supplement_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    start_date DATE,
    end_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

-- Create health metrics table for medical compliance
CREATE TABLE IF NOT EXISTS health_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    metric_type VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,2),
    unit VARCHAR(50),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

-- Create audit log table for GDPR compliance
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(255) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create consent records table for GDPR compliance
CREATE TABLE IF NOT EXISTS consent_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    consent_type VARCHAR(100) NOT NULL,
    granted BOOLEAN NOT NULL,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    withdrawn_at TIMESTAMP WITH TIME ZONE,
    version VARCHAR(10) DEFAULT '1.0',
    ip_address INET,
    source VARCHAR(50) DEFAULT 'web',
    purpose TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_supplement_tracking_user_id ON supplement_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_id ON health_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_consent_records_user_id ON consent_records(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supplement_tracking_updated_at BEFORE UPDATE ON supplement_tracking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for development
INSERT INTO user_profiles (user_id, email, name) VALUES
    ('dev_user_1', 'dev@example.com', 'Development User'),
    ('test_user_1', 'test@example.com', 'Test User')
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample supplement tracking data
INSERT INTO supplement_tracking (user_id, supplement_name, dosage, frequency, start_date, notes) VALUES
    ('dev_user_1', 'Vitamin D3', '2000 IU', 'Daily', CURRENT_DATE - INTERVAL '30 days', 'Morning supplement'),
    ('dev_user_1', 'Omega-3', '1000mg', 'Daily', CURRENT_DATE - INTERVAL '20 days', 'Evening supplement'),
    ('test_user_1', 'Magnesium', '400mg', 'Daily', CURRENT_DATE - INTERVAL '10 days', 'Before bedtime')
ON CONFLICT DO NOTHING;

-- Insert sample consent records
INSERT INTO consent_records (user_id, consent_type, granted, purpose) VALUES
    ('dev_user_1', 'necessary', true, 'Basic app functionality'),
    ('dev_user_1', 'analytics', true, 'Usage analytics and improvements'),
    ('dev_user_1', 'medical_tracking', true, 'Supplement tracking and health insights'),
    ('test_user_1', 'necessary', true, 'Basic app functionality'),
    ('test_user_1', 'analytics', false, 'Usage analytics and improvements')
ON CONFLICT DO NOTHING;

-- Create RLS (Row Level Security) policies for medical data protection
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplement_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

-- Create policies for user data access (users can only access their own data)
CREATE POLICY user_profiles_policy ON user_profiles FOR ALL USING (user_id = current_setting('app.current_user_id', TRUE));
CREATE POLICY supplement_tracking_policy ON supplement_tracking FOR ALL USING (user_id = current_setting('app.current_user_id', TRUE));
CREATE POLICY health_metrics_policy ON health_metrics FOR ALL USING (user_id = current_setting('app.current_user_id', TRUE));
CREATE POLICY consent_records_policy ON consent_records FOR ALL USING (user_id = current_setting('app.current_user_id', TRUE));

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO suplementor;
GRANT ALL ON ALL TABLES IN SCHEMA public TO suplementor;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO suplementor;

-- Create function to set current user for RLS
CREATE OR REPLACE FUNCTION set_current_user(user_id_param VARCHAR)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_user_id', user_id_param, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION set_current_user(VARCHAR) TO suplementor;

COMMENT ON DATABASE suplementor_dev IS 'Suplementor development database with medical compliance features';