import { supabase } from '../server/db';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    console.log('🔄 Starting database migrations...');

    // Read migration files in order
    const migrationFiles = [
      '000_cleanup.sql',
      '001_init_schema.sql',
      '002_helper_functions.sql'
    ];

    for (const file of migrationFiles) {
      console.log(`\n📜 Running migration: ${file}`);
      const filePath = path.join(__dirname, 'sql', file);
      const sql = fs.readFileSync(filePath, 'utf8');

      // Execute each statement using raw SQL query
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
      
      if (error) {
        console.warn(`⚠️ Warning executing ${file}:`, error.message);
        // Continue anyway as some errors might be expected (e.g., table already exists)
      } else {
        console.log(`✅ Successfully executed ${file}`);
      }
    }

    console.log('\n🎉 All migrations completed!');
    
    // Simple verification - try to select from users table
    const { error: testError } = await supabase
      .from('users')
      .select('count(*)')
      .single();
    
    if (testError) {
      console.error('❌ Migration verification failed:', testError.message);
      process.exit(1);
    }

    console.log('✅ Database schema verified successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations
runMigrations();