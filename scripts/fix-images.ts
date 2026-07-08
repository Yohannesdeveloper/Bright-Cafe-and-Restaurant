const { createClient } = require('@supabase/supabase-js');
const s = createClient('https://stnwzgzndyzkesztwxkd.supabase.co','sb_publishable_8v-ByH-mO0am0e0NY4fPmw_rDklkfQ2');

const img = (id) => `https://images.unsplash.com/photo-${id}?w=600&auto=format&fit=crop`;

// Item name → image URL mapping (name matching is case-insensitive, substring)
const pimg = (url: string) => url; // raw URL

// Use exact name matching to avoid substring false positives
const EXACT = {
  'Honey':               img('1689777254817-d357d0223660'),
  'Mayonnaise':          img('1638697586690-37f66f05083a'),
  'Ketchup':             img('1613515766737-2bca4972f4e4'),
  'Hot Sauce':           img('1657049012733-0692156dcf77'),
  'Jam':                 img('1774569037027-921815b56b56'),    // bread with strawberry jam
  'Pancake Syrup':       img('1671522636384-abaa828ec275'),    // maple syrup on pancakes
  'Butter':              pimg('https://images.pexels.com/photos/4182678/pexels-photo-4182678.jpeg?auto=compress&cs=tinysrgb&w=600'),
  
  // Fix breakfast items that were incorrectly matched by substring
  'Fetira with Honey':   img('1495214783159-3503fd1b572d'),   // revert to breakfast image
  'Teff Chechebsa with Honey': img('1495214783159-3503fd1b572d'), // revert to breakfast image
};

// Substring/keyword matching for bulk updates (only for items NOT in EXACT)
const KEYWORD = [
  // Ethiopian - better injera/traditional food photos
  { match: 'Lamb Tibs',                    img: img('1765338915553-6e02fe63ff4f') },
  { match: 'Chikina Tibs',                 img: img('1765338915553-6e02fe63ff4f') },
  { match: 'Dulet',                        img: img('1765338915553-6e02fe63ff4f') },
  { match: 'Fasting Combo',                img: img('1777126292369-ea156fefc41a') },
  { match: 'Fasting Firfir',               img: img('1777126292369-ea156fefc41a') },
];

async function main() {
  // Fetch all items
  const { data: items, error } = await s.from('menu_items').select('id, name, category, image');
  if (error) { console.error('Fetch error:', error); return; }
  
  console.log(`Total items: ${items.length}`);

  let updated = 0;
  for (const item of items) {
    // First try exact match
    if (EXACT[item.name]) {
      const newUrl = EXACT[item.name];
      if (item.image !== newUrl) {
        const { error: updateError } = await s.from('menu_items').update({ image: newUrl }).eq('id', item.id);
        if (updateError) console.error(`  FAIL id=${item.id} "${item.name}": ${updateError.message}`);
        else { console.log(`  OK id=${item.id} "${item.name}" (exact)`); updated++; }
      }
      continue;
    }
    // Try keyword match
    for (const kw of KEYWORD) {
      if (item.name.includes(kw.match) && item.image !== kw.img) {
        const { error: updateError } = await s.from('menu_items').update({ image: kw.img }).eq('id', item.id);
        if (updateError) console.error(`  FAIL id=${item.id} "${item.name}": ${updateError.message}`);
        else { console.log(`  OK id=${item.id} "${item.name}" (keyword: ${kw.match})`); updated++; }
        break;
      }
    }
  }
  console.log(`\nUpdated ${updated} items`);
}

main().catch(console.error);
