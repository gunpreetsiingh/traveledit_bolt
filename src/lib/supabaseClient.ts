import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on your schema
export interface User {
  id: string;
  role: string | null;
  name: string | null;
  email: string | null;
  advisor_id: string | null;
  created_at: string | null;
  google_id: string | null;
  auth_provider: string | null;
  profile_image_url: string | null;
  last_login_at: string | null;
  language: string | null;
}

export interface UserDetails {
  user_id: string;
  full_name: string | null;
  date_of_birth: string | null;
  passport_number: string | null;
  passport_country: string | null;
  passport_expiry: string | null;
  home_airport: string | null;
  citizenship_country: string | null;
  address: any | null;
  phone: string | null;
  emergency_contact: any | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface QuestionnaireSession {
  id: string;
  session_id: string;
  created_at: string | null;
  updated_at: string | null;
  completed_at: string | null;
  questionnaire_data: any;
  metadata: any | null;
}

// Helper function to test database connection
export async function testConnection() {
  try {
    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Database connection error:', error);
      return { success: false, error };
    }
    
    console.log('Database connection successful!', { count });
    return { success: true, data: { count } };
  } catch (err) {
    console.error('Connection test failed:', err);
    return { success: false, error: err };
  }
}

// Helper function to get all table names (for verification)
export async function getTableList() {
  try {
    // Test access to each table by doing a count query
    const tables = [
      'users', 'user_details', 'questionnaire_sessions', 'questionnaire_responses',
      'questionnaire_images', 'questionnaire_versions', 'questions', 'question_categories',
      'question_options', 'answers', 'user_insights', 'user_messages', 'message_attachments',
      'message_insight_links', 'message_trip_element_links', 'trip_elements', 
      'trip_element_relationships', 'trip_element_suppliers', 'collections', 'collection_items',
      'suppliers', 'tasks', 'flight_alerts', 'destination_checks', 'user_documents',
      'ai_summaries', 'llm_feedback', 'global_settings'
    ];
    
    const results = [];
    
    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          results.push({ table, accessible: false, error: error.message });
        } else {
          results.push({ table, accessible: true, count: count || 0 });
        }
      } catch (err) {
        results.push({ table, accessible: false, error: 'Unknown error' });
      }
    }
    
    return results;
  } catch (err) {
    console.error('Table list test failed:', err);
    return [];
  }
}