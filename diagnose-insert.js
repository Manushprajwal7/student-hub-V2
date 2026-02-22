const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qxdgurfexsecyqzqkqqo.supabase.co';
const supabaseKey = 'sb_publishable_ga_KaXCo_QVD_mFFAjQ6NQ_soknnmdx';

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnosticInsert() {
  const { data: profiles } = await supabase.from('profiles').select('user_id').limit(1);
  if (!profiles || profiles.length === 0) {
    console.error('No profiles found to test with.');
    return;
  }
  const user_id = profiles[0].user_id;

  console.log('Testing insert on "issues" table with user_id:', user_id);
  
  const { error } = await supabase
    .from('issues')
    .insert([{
      title: "Diagnostic Test Entry",
      description: "Testing if programmatic inserts are allowed via anon key.",
      location: "Lab",
      category: "Infrastructure",
      user_id: user_id
    }]);

  if (error) {
    console.error('INSERT FAILED:', error.message, error.code, error.details);
  } else {
    console.log('INSERT SUCCESSFUL. RLS might be disabled or configured to allow anon inserts.');
  }
}

diagnosticInsert();
