
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  const tables = ['profiles', 'issues', 'events', 'announcements', 'jobs', 'study_groups', 'scholarships', 'resources'];
  
  console.log("--- Supabase Diagnostic ---");
  console.log(`URL: ${supabaseUrl}`);
  
  for (const table of tables) {
    console.log(`\nTesting table: ${table}...`);
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
      
    if (error) {
      console.error(`❌ Error querying ${table}:`, error.message, error.details, error.hint);
    } else {
      console.log(`✅ Success! Count: ${count}`);
      
      // Try fetching one row to see columns
      const { data: row, error: rowError } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      if (rowError) {
        console.error(`❌ Error fetching row from ${table}:`, rowError.message);
      } else if (row && row.length > 0) {
        console.log(`Columns: ${Object.keys(row[0]).join(', ')}`);
      } else {
        console.log("No data in table to inspect columns.");
      }
    }
  }
}

testConnection();
