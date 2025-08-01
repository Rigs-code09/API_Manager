import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables:', {
    url: supabaseUrl ? 'Set' : 'Missing',
    key: supabaseAnonKey ? 'Set' : 'Missing'
  });
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test Supabase connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('Connection test failed:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, message: 'Connected successfully' };
  } catch (err) {
    console.error('Connection test error:', err);
    return { success: false, error: err.message };
  }
}

// API Keys service functions
export const apiKeysService = {
  // Get all API keys
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Supabase getAll error:', error);
        throw new Error(`Database error: ${error.message || 'Unknown error'}`);
      }
      
      return data || []
    } catch (err) {
      console.error('Get API keys error:', err);
      throw err;
    }
  },

  // Create new API key
  async create(apiKeyData) {
    try {
      console.log('Creating API key with data:', apiKeyData);
      console.log('Supabase client status:', {
        url: supabaseUrl,
        hasClient: !!supabase
      });

      const insertData = {
        name: apiKeyData.name,
        description: apiKeyData.description || '',
        api_key: apiKeyData.api_key, // Use correct column name
        permissions: apiKeyData.permissions || 'read',
        limit_usage: apiKeyData.limitUsage || false,
        monthly_limit: apiKeyData.monthlyLimit || 1000,
        usage_count: 0
      };
      
      console.log('Insert data:', insertData);

      const { data, error } = await supabase
        .from('api_keys')
        .insert([insertData])
        .select()
      
      console.log('Supabase response:', { data, error });
      
      if (error) {
        console.error('Supabase create error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw new Error(`Database error: ${error.message || error.hint || JSON.stringify(error)}`);
      }
      
      if (!data || data.length === 0) {
        throw new Error('No data returned from database');
      }
      
      console.log('Successfully created API key:', data[0]);
      return data[0]
    } catch (err) {
      console.error('Create API key error:', err);
      console.error('Error type:', typeof err);
      console.error('Error stack:', err.stack);
      throw err;
    }
  },

  // Update API key
  async update(id, updates) {
    const { data, error } = await supabase
      .from('api_keys')
      .update({
        name: updates.name,
        description: updates.description || '',
        permissions: updates.permissions || 'read',
        limit_usage: updates.limitUsage || false,
        monthly_limit: updates.monthlyLimit || 1000
      })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete API key
  async delete(id) {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Update usage count
  async updateUsage(id, usageCount) {
    const { data, error } = await supabase
      .from('api_keys')
      .update({ 
        usage_count: usageCount, // Use correct column name
        last_used: new Date().toISOString()
      })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  }
} 