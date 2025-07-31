-- Drop the existing table if you need to start fresh
-- DROP TABLE IF EXISTS api_keys;

-- Create API Keys table with correct structure
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  api_key VARCHAR(255) NOT NULL UNIQUE,
  permissions VARCHAR(50) DEFAULT 'read' CHECK (permissions IN ('read', 'write', 'admin')),
  limit_usage BOOLEAN DEFAULT false,
  monthly_limit INTEGER DEFAULT 1000,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE
);

-- If you already have the table but with wrong column name, use this to rename:
-- ALTER TABLE api_keys RENAME COLUMN key TO api_key;

-- OR if you have the table with 'key' column, you can add the api_key column:
-- ALTER TABLE api_keys ADD COLUMN api_key VARCHAR(255);
-- UPDATE api_keys SET api_key = key WHERE api_key IS NULL;
-- ALTER TABLE api_keys ALTER COLUMN api_key SET NOT NULL;
-- ALTER TABLE api_keys ADD CONSTRAINT api_keys_api_key_unique UNIQUE (api_key);

-- Create RLS (Row Level Security) policies
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON api_keys;
DROP POLICY IF EXISTS "Allow read access for anonymous users" ON api_keys;

-- Allow all operations for authenticated users (you can make this more restrictive)
CREATE POLICY "Allow all operations for authenticated users" ON api_keys
  FOR ALL USING (auth.role() = 'authenticated');

-- Allow read access for anonymous users (optional, remove if you want auth only)
CREATE POLICY "Allow read access for anonymous users" ON api_keys
  FOR SELECT USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_api_keys_updated_at ON api_keys;

CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 