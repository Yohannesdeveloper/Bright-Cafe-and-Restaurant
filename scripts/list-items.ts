const { createClient } = require('@supabase/supabase-js');
const s = createClient('https://stnwzgzndyzkesztwxkd.supabase.co','sb_publishable_8v-ByH-mO0am0e0NY4fPmw_rDklkfQ2');

async function m() {
  const {data} = await s.from('menu_items').select('id,name,category,image').order('category');
  let current = '';
  data.forEach(i => {
    if (i.category !== current) {
      console.log(`\n--- ${i.category} ---`);
      current = i.category;
    }
    const pid = i.image?.split('photo-')[1]?.substring(0,16)||'emoji';
    console.log(`  ${String(i.id).padStart(3)}: ${i.name}`);
    console.log(`       → ${pid}`);
  });
}
m().catch(console.error);
