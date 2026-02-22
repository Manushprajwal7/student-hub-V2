const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qxdgurfexsecyqzqkqqo.supabase.co';
const supabaseKey = 'sb_publishable_ga_KaXCo_QVD_mFFAjQ6NQ_soknnmdx';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCounts() {
  const tables = ['issues', 'events', 'announcements', 'resources', 'jobs', 'study_groups', 'scholarships'];
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.error(`Error checking ${table}:`, error.message);
    } else {
      console.log(`${table}: ${count} rows`);
    }
  }
}

checkCounts();
