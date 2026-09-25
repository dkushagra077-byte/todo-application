const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn(
    '[WARNING] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in environment variables. ' +
    'Please check your backend-todo/.env configuration.'
  );
}

// Service role client runs securely on the backend server.
// Never expose this client or SUPABASE_SERVICE_ROLE_KEY to the browser/frontend.
const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseServiceRoleKey || 'placeholder_key', {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

module.exports = supabase;
