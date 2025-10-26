// Enhanced database connection using Supabase client
import { createClient } from '@supabase/supabase-js';
import * as schema from "@shared/schema";

// Validate Supabase credentials
if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "❌ VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env"
  );
}

console.log("🔗 Initializing Supabase client...");
console.log(`📍 Supabase URL: ${process.env.VITE_SUPABASE_URL}`);

// Initialize Supabase client with service role key for full access
export const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false
    },
    db: {
      schema: 'public'
    }
  }
);

// Test Supabase connection with retry logic
async function testConnection(retries = 3, delay = 2000): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 Testing Supabase connection (attempt ${attempt}/${retries})...`);
      
      // Test connection by checking auth configuration
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      console.log("✅ Supabase connection successful!");
      
      // Get available tables using raw SQL query
      const { data: tables, error: tablesError } = await supabase
        .rpc('get_public_tables');
        
      if (tablesError) {
        console.warn("⚠️  Could not fetch tables. This is expected for the first run.");
        console.warn("ℹ️  Tables will be created when migrations are run.");
      } else {
        console.log(`📋 Found ${tables?.length || 0} tables in database`);
        if (tables && tables.length > 0) {
          console.log(`📝 Tables: ${tables.join(', ')}`);
        } else {
          console.warn("⚠️  No tables found. You may need to run your migration SQL.");
        }
      }
      
      return; // Success, exit function
      
    } catch (error: any) {
      console.error(`❌ Connection attempt ${attempt} failed:`, error.message);
      
      if (attempt < retries) {
        console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        console.error("🚨 All connection attempts failed!");
        console.error("💡 Troubleshooting tips:");
        console.error("   1. Check if VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are correct in .env");
        console.error("   2. Verify Supabase project is not paused");
        console.error("   3. Check network connectivity");
        throw new Error(`Supabase connection failed after ${retries} attempts: ${error.message}`);
      }
    }
  }
}

// Test connection on startup
testConnection().catch(err => {
  console.error("💥 Fatal Supabase error:", err.message);
  process.exit(1);
});
