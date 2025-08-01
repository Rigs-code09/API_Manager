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
      // Add timeout to prevent infinite loading
      const queryPromise = supabase
        .from('api_keys')
        .select('id, name, key, type, usage, created_at')
        .order('created_at', { ascending: false })
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000)
      );
      
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);
      
      if (error) {
        console.error('Supabase getAll error:', error);
        
        // Provide more specific error messages
        if (error.code === 'PGRST116') {
          throw new Error(`Database table 'api_keys' does not exist. Please run the SQL schema from UPDATED_SCHEMA.sql`);
        } else if (error.code === '42501') {
          throw new Error(`Permission denied. Check Row Level Security policies in Supabase.`);
        } else if (error.message.includes('JWT')) {
          throw new Error(`Invalid Supabase credentials. Check your environment variables.`);
        } else {
          throw new Error(`Database error: ${error.message || 'Unknown error'}`);
        }
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
      const insertData = {
        name: apiKeyData.name,
        key: apiKeyData.key, // Use 'key' column name from your database
        type: apiKeyData.type, // Use 'type' column name from your database
        usage: apiKeyData.usage || 0
      };

      const { data, error } = await supabase
        .from('api_keys')
        .insert([insertData])
        .select()
      
      if (error) {
        console.error('Supabase create error:', error);
        throw new Error(`Database error: ${error.message || error.hint || JSON.stringify(error)}`);
      }
      
      if (!data || data.length === 0) {
        throw new Error('No data returned from database');
      }
      
      return data[0]
    } catch (err) {
      console.error('Create API key error:', err);
      throw err;
    }
  },

  // Update API key
  async update(id, updates) {
    const updateData = {
      name: updates.name,
      type: updates.permissions || 'read' // Map permissions to type column
    };

    const { data, error } = await supabase
      .from('api_keys')
      .update(updateData)
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
        usage: usageCount // Use 'usage' column name from your database
      })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  }
} 