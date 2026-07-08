const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://stnwzgzndyzkesztwxkd.supabase.co';
const supabaseKey = 'sb_publishable_8v-ByH-mO0am0e0NY4fPmw_rDklkfQ2';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding database...');

  // Menu Items
  const { error: menuError } = await supabase.from('menu_items').insert([
    // Beverages
    { name: '1/2 Liter Water', category: 'beverages', price: 47.82, description: '', image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=600&auto=format&fit=crop' },
    { name: '1/4 Liter Water', category: 'beverages', price: 34.78, description: '', image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=600&auto=format&fit=crop' },
    { name: '1 Liter Water', category: 'beverages', price: 56.51, description: '', image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=600&auto=format&fit=crop' },
    { name: 'Soft Drinks', category: 'beverages', price: 78.25, description: '', image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=600&auto=format&fit=crop' },
    { name: 'Ambo', category: 'beverages', price: 78.25, description: '', image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=600&auto=format&fit=crop' },
    { name: 'Malta Guinness', category: 'beverages', price: 180.40, description: '', image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&auto=format&fit=crop' },
    { name: 'Soft Malt', category: 'beverages', price: 130.43, description: '', image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&auto=format&fit=crop' },
    { name: 'Coke 500ml', category: 'beverages', price: 18.26, description: '', image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=600&auto=format&fit=crop' },
    { name: 'Red Bull', category: 'beverages', price: 212.17, description: '', image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=600&auto=format&fit=crop' },
    { name: 'Rift Valley', category: 'beverages', price: 343.47, description: 'Wine', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop' },
    { name: 'Chardonnay', category: 'beverages', price: 255.65, description: 'Wine', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop' },
    { name: 'Accacia', category: 'beverages', price: 565.25, description: 'Wine', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop' },
    { name: 'Cavee', category: 'beverages', price: 382.60, description: 'Wine', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop' },
    { name: 'Axumit', category: 'beverages', price: 291.30, description: '', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop' },
    { name: 'Kemila', category: 'beverages', price: 291.30, description: '', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop' },
    { name: 'Beer', category: 'beverages', price: 130.04, description: '', image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&auto=format&fit=crop' },
    { name: 'Gebeta', category: 'beverages', price: 316.52, description: 'Wine', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop' },
    { name: 'Novida', category: 'beverages', price: 78.21, description: '', image: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=600&auto=format&fit=crop' },

    // Hot Drinks
    { name: 'Macchiato', category: 'hot_drinks', price: 95.64, description: '', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop' },
    { name: 'Fasting Macchiato', category: 'hot_drinks', price: 147.43, description: '', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop' },
    { name: 'Coffee', category: 'hot_drinks', price: 95.65, description: '', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop' },
    { name: 'Traditional Coffee', category: 'hot_drinks', price: 34.78, description: '', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop' },
    { name: 'Espresso', category: 'hot_drinks', price: 95.65, description: '', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop' },
    { name: 'Milk with Coffee', category: 'hot_drinks', price: 121.73, description: '', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop' },
    { name: 'American Coffee', category: 'hot_drinks', price: 60.86, description: '', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop' },
    { name: 'Cappuccino', category: 'hot_drinks', price: 147.73, description: '', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop' },
    { name: 'Café Latte', category: 'hot_drinks', price: 121.73, description: '', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop' },
    { name: 'Special Tea', category: 'hot_drinks', price: 173.13, description: '', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop' },
    { name: 'Tea', category: 'hot_drinks', price: 43.47, description: '', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop' },
    { name: 'Lepton Tea', category: 'hot_drinks', price: 34.78, description: '', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop' },
    { name: 'Tea Spice', category: 'hot_drinks', price: 95.60, description: '', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop' },
    { name: 'Green Tea', category: 'hot_drinks', price: 52.17, description: '', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop' },
    { name: 'Hot Milk', category: 'hot_drinks', price: 130.43, description: '', image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop' },
    { name: 'Ginger Tea', category: 'hot_drinks', price: 69.56, description: '', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop' },
    { name: 'Peanut Tea', category: 'hot_drinks', price: 95.65, description: '', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop' },
    { name: 'Tea with Lemon', category: 'hot_drinks', price: 52.17, description: '', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop' },
    { name: 'Hot Chocolate', category: 'hot_drinks', price: 130.43, description: '', image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop' },

    // Juice
    { name: 'Bright Special Juice', category: 'juice', price: 234.78, description: '', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&auto=format&fit=crop' },
    { name: 'Banana Shake', category: 'juice', price: 173.90, description: '', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=600&auto=format&fit=crop' },
    { name: 'Mixed Juice', category: 'juice', price: 173.90, description: '', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&auto=format&fit=crop' },
    { name: 'Papaya', category: 'juice', price: 173.90, description: '', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&auto=format&fit=crop' },
    { name: 'Pineapple', category: 'juice', price: 173.90, description: '', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&auto=format&fit=crop' },
    { name: 'Avocado', category: 'juice', price: 191.30, description: '', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=600&auto=format&fit=crop' },
    { name: 'Strawberry', category: 'juice', price: 199.00, description: '', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&auto=format&fit=crop' },
    { name: 'Mango', category: 'juice', price: 173.90, description: '', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&auto=format&fit=crop' },
    { name: 'Strawberry with Milk', category: 'juice', price: 217.39, description: '', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=600&auto=format&fit=crop' },
    { name: 'Fruit Cocktail', category: 'juice', price: 173.04, description: '', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&auto=format&fit=crop' },
    { name: 'Strawberry Mix', category: 'juice', price: 191.30, description: '', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&auto=format&fit=crop' },

    // Breakfast
    { name: 'Bright Special Ful', category: 'breakfast', price: 417.39, description: '', image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&auto=format&fit=crop' },
    { name: 'Special Ful', category: 'breakfast', price: 321.73, description: '', image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&auto=format&fit=crop' },
    { name: 'Normal Ful', category: 'breakfast', price: 304.34, description: '', image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&auto=format&fit=crop' },
    { name: 'Yogurt', category: 'breakfast', price: 130.14, description: '', image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop' },
    { name: 'Tuna Sils', category: 'breakfast', price: 365.21, description: '', image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&auto=format&fit=crop' },
    { name: 'Egg with Tomato Sauce', category: 'breakfast', price: 260.86, description: '', image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&auto=format&fit=crop' },
    { name: 'Omelette with Cheese', category: 'breakfast', price: 321.73, description: '', image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&auto=format&fit=crop' },
    { name: 'Fried Egg', category: 'breakfast', price: 260.81, description: '', image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&auto=format&fit=crop' },
    { name: 'Plain Omelette', category: 'breakfast', price: 260.81, description: '', image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&auto=format&fit=crop' },
    { name: 'Tomato Sils', category: 'breakfast', price: 243.45, description: '', image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&auto=format&fit=crop' },
    { name: 'Scrambled Egg', category: 'breakfast', price: 252.13, description: '', image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&auto=format&fit=crop' },
    { name: 'Fetira with Honey', category: 'breakfast', price: 260.86, description: '', image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&auto=format&fit=crop' },
    { name: 'Fetira with Egg', category: 'breakfast', price: 286.95, description: '', image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&auto=format&fit=crop' },
    { name: 'Special Omelette', category: 'breakfast', price: 330.43, description: '', image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&auto=format&fit=crop' },
    { name: 'Chechebsa', category: 'breakfast', price: 260.25, description: '', image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&auto=format&fit=crop' },
    { name: 'Special Chechebsa', category: 'breakfast', price: 313.04, description: '', image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&auto=format&fit=crop' },
    { name: 'Tef Chechebsa with Honey', category: 'breakfast', price: 269.56, description: '', image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&auto=format&fit=crop' },
    { name: 'Tef Chechebsa with Egg', category: 'breakfast', price: 304.34, description: '', image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&auto=format&fit=crop' },
    { name: 'Special Tef Chechebsa', category: 'breakfast', price: 321.73, description: '', image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&auto=format&fit=crop' },
    { name: 'Tef Chechebsa Plain', category: 'breakfast', price: 217.39, description: '', image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&auto=format&fit=crop' },
    { name: 'Special Fetira', category: 'breakfast', price: 304.34, description: '', image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&auto=format&fit=crop' },

    // Salad
    { name: 'Bright Special Salad', category: 'salad', price: 504.34, description: '', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop' },
    { name: 'Mixed Salad', category: 'salad', price: 304.34, description: '', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop' },
    { name: 'Tuna Salad (Special)', category: 'salad', price: 521.73, description: '', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop' },
    { name: 'Chicken Salad', category: 'salad', price: 512.17, description: '', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop' },

    // Pizza
    { name: 'Bright Special Pizza 40x30cm', category: 'pizza', price: 782.60, description: '', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop' },
    { name: 'Special Pizza', category: 'pizza', price: 739.13, description: '', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop' },
    { name: 'Vegetable with Tuna', category: 'pizza', price: 686.95, description: '', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop' },
    { name: 'Margarita Pizza', category: 'pizza', price: 608.69, description: '', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop' },
    { name: 'Meat Lover Pizza', category: 'pizza', price: 664.56, description: '', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop' },
    { name: 'Chicken Pizza', category: 'pizza', price: 730.43, description: '', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop' },
    { name: 'Vegetable Pizza', category: 'pizza', price: 521.73, description: '', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop' },
    { name: 'Tuna Pizza', category: 'pizza', price: 669.56, description: '', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop' },
    { name: 'Altono Pizza', category: 'pizza', price: 739.13, description: '', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop' },

    // Pasta
    { name: 'Tomato Sauce Pasta', category: 'pasta', price: 313.04, description: '', image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=600&auto=format&fit=crop' },
    { name: 'Bolognaise Sauce Pasta', category: 'pasta', price: 391.30, description: '', image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=600&auto=format&fit=crop' },
    { name: 'Vegetable Pasta', category: 'pasta', price: 321.73, description: '', image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=600&auto=format&fit=crop' },
    { name: 'Tuna Sauce Pasta', category: 'pasta', price: 496.56, description: '', image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=600&auto=format&fit=crop' },
    { name: 'Vegetable with Tuna Pasta', category: 'pasta', price: 478.26, description: '', image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=600&auto=format&fit=crop' },
    { name: 'Rice with Vegetable', category: 'pasta', price: 347.82, description: '', image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=600&auto=format&fit=crop' },

    // Fish
    { name: 'Fish Cutlet', category: 'fish', price: 521.13, description: '', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop' },
    { name: 'Grilled Fish', category: 'fish', price: 521.73, description: '', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop' },
    { name: 'Fish Goulash', category: 'fish', price: 521.73, description: '', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop' },
    { name: 'Fish Package', category: 'fish', price: 547.82, description: '', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop' },
    { name: 'Stir Fried Fish', category: 'fish', price: 547.82, description: '', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop' },

    // Burger & Sandwich
    { name: 'Bright Special Double Beef Burger', category: 'burger', price: 608.69, description: '', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&auto=format&fit=crop' },
    { name: 'Bright Special Burger', category: 'burger', price: 565.21, description: '', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&auto=format&fit=crop' },
    { name: 'Beef Burger', category: 'burger', price: 495.65, description: '', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&auto=format&fit=crop' },
    { name: 'Chicken Burger', category: 'burger', price: 591.35, description: '', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&auto=format&fit=crop' },
    { name: 'Cheese Burger', category: 'burger', price: 504.34, description: '', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&auto=format&fit=crop' },
    { name: 'Fish Burger', category: 'burger', price: 460.80, description: '', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&auto=format&fit=crop' },
    { name: 'Tuna Sandwich', category: 'burger', price: 478.26, description: '', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop' },
    { name: 'Club Sandwich', category: 'burger', price: 521.43, description: '', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop' },
    { name: 'Vegetable Burger', category: 'burger', price: 278.60, description: '', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&auto=format&fit=crop' },
    { name: 'Beef Combo', category: 'burger', price: 347.78, description: '', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&auto=format&fit=crop' },
    { name: 'Egg Burger', category: 'burger', price: 260.86, description: '', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&auto=format&fit=crop' },
    { name: 'French Fries', category: 'burger', price: 265.21, description: '', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop' },
    { name: 'Chicken Combo', category: 'burger', price: 478.26, description: '', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&auto=format&fit=crop' },
    { name: 'Grilled Beef Fillet Steak', category: 'burger', price: 321.73, description: '', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&auto=format&fit=crop' },
    { name: 'Roasted Chicken Breast', category: 'burger', price: 565.21, description: '', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&auto=format&fit=crop' },
    { name: 'Grilled Tilapia Fish', category: 'burger', price: 439.30, description: '', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop' },
    { name: 'Chicken Sandwich', category: 'burger', price: 539.00, description: '', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop' },
    { name: 'Lasagna', category: 'burger', price: 365.00, description: '', image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=600&auto=format&fit=crop' },
    { name: 'Tuna Club Sandwich', category: 'burger', price: 608.69, description: '', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop' },

    // Cake
    { name: 'Tiramisu with Cup', category: 'cake', price: 260.86, description: '', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop' },
    { name: 'Tiramisu', category: 'cake', price: 260.86, description: '', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop' },
    { name: 'Chocolate Cake', category: 'cake', price: 260.86, description: '', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop' },
    { name: 'White Forest Torta', category: 'cake', price: 1739.15, description: '', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop' },
    { name: 'Black Forest Torta', category: 'cake', price: 1739.13, description: '', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop' },
    { name: 'Tiramisu Torta', category: 'cake', price: 2173.91, description: '', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop' },
    { name: 'Banana Cake', category: 'cake', price: 139.13, description: '', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop' },
    { name: 'Sambusa Meat', category: 'cake', price: 121.73, description: '', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop' },
    { name: 'Sambusa Lentil', category: 'cake', price: 104.34, description: '', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop' },
    { name: 'Black Forest', category: 'cake', price: 260.86, description: '', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop' },
    { name: 'White Forest', category: 'cake', price: 260.86, description: '', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop' },
    { name: 'Marble Cake', category: 'cake', price: 136.52, description: '', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop' },
    { name: 'Caramel Fasting', category: 'cake', price: 260.86, description: '', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&auto=format&fit=crop' },

    // Extras
    { name: 'Bread', category: 'extras', price: 15.43, description: '', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop' },
    { name: 'Tuna', category: 'extras', price: 130.43, description: '', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop' },
    { name: 'Cheese', category: 'extras', price: 156.52, description: '', image: 'https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?w=600&auto=format&fit=crop' },
    { name: 'Egg', category: 'extras', price: 26.08, description: '', image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&auto=format&fit=crop' },
    { name: 'Milk', category: 'extras', price: 60.86, description: '', image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop' },
    { name: 'Butter', category: 'extras', price: 60.86, description: '', image: 'https://images.pexels.com/photos/4182678/pexels-photo-4182678.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { name: 'Olive', category: 'extras', price: 86.95, description: '', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop' },
    { name: 'Mushroom', category: 'extras', price: 86.95, description: '', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop' },
    { name: 'Honey', category: 'extras', price: 60.86, description: '', image: 'https://images.unsplash.com/photo-1689777254817-d357d0223660?w=600&auto=format&fit=crop' },
    { name: 'Mayonnaise', category: 'extras', price: 95.65, description: '', image: 'https://images.unsplash.com/photo-1638697586690-37f66f05083a?w=600&auto=format&fit=crop' },
    { name: 'Ketchup', category: 'extras', price: 52.50, description: '', image: 'https://images.unsplash.com/photo-1613515766737-2bca4972f4e4?w=600&auto=format&fit=crop' },
    { name: 'Hot Sauce', category: 'extras', price: 52.50, description: '', image: 'https://images.unsplash.com/photo-1657049012733-0692156dcf77?w=600&auto=format&fit=crop' },
    { name: 'Jam', category: 'extras', price: 17.39, description: '', image: 'https://images.unsplash.com/photo-1774569037027-921815b56b56?w=600&auto=format&fit=crop' },
    { name: 'Pancake Syrup', category: 'extras', price: 34.78, description: '', image: 'https://images.unsplash.com/photo-1671522636384-abaa828ec275?w=600&auto=format&fit=crop' },
    { name: 'Extra Vegetable', category: 'extras', price: 43.47, description: '', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop' },

    // Ethiopian Food
    { name: 'በየአይነቱ', category: 'ethiopian', price: 391.30, description: 'የሐበሻ ምግብ', image: 'https://images.unsplash.com/photo-1634650947274-0c3fa9d8ee8a?w=600&auto=format&fit=crop' },
    { name: 'ሽሮ', category: 'ethiopian', price: 260.86, description: 'የሐበሻ ምግብ', image: 'https://images.unsplash.com/photo-1634650947274-0c3fa9d8ee8a?w=600&auto=format&fit=crop' },
    { name: 'የፆም ፍርፍር', category: 'ethiopian', price: 217.39, description: 'የሐበሻ ምግብ', image: 'https://images.unsplash.com/photo-1634650947274-0c3fa9d8ee8a?w=600&auto=format&fit=crop' },
    { name: 'ቲማቲም ቁርጥ', category: 'ethiopian', price: 295.65, description: 'የሐበሻ ምግብ', image: 'https://images.unsplash.com/photo-1634650947274-0c3fa9d8ee8a?w=600&auto=format&fit=crop' },
    { name: 'ሱፍ ፍትፍት', category: 'ethiopian', price: 278.26, description: 'የሐበሻ ምግብ', image: 'https://images.unsplash.com/photo-1634650947274-0c3fa9d8ee8a?w=600&auto=format&fit=crop' },
    { name: 'የዖም ኮንቦ', category: 'ethiopian', price: 404.34, description: 'የሐበሻ ምግብ', image: 'https://images.unsplash.com/photo-1634650947274-0c3fa9d8ee8a?w=600&auto=format&fit=crop' },
    { name: 'ሽሮ በቲማቲም', category: 'ethiopian', price: 304.39, description: 'የሐበሻ ምግብ', image: 'https://images.unsplash.com/photo-1634650947274-0c3fa9d8ee8a?w=600&auto=format&fit=crop' },
    { name: 'የፆም ድርቆሽ ፍርፍር', category: 'ethiopian', price: 260.86, description: 'የሐበሻ ምግብ', image: 'https://images.unsplash.com/photo-1634650947274-0c3fa9d8ee8a?w=600&auto=format&fit=crop' },
    { name: 'የበግ ጥብስ', category: 'ethiopian', price: 434.78, description: 'የሐበሻ ምግብ', image: 'https://images.unsplash.com/photo-1765338915553-6e02fe63ff4f?w=600&auto=format&fit=crop' },
    { name: 'ጭቅና ጥብስ', category: 'ethiopian', price: 521.17, description: 'የሐበሻ ምግብ', image: 'https://images.unsplash.com/photo-1765338915553-6e02fe63ff4f?w=600&auto=format&fit=crop' },
    { name: 'ድለት', category: 'ethiopian', price: 347.82, description: 'የሐበሻ ምግብ', image: 'https://images.unsplash.com/photo-1765338915553-6e02fe63ff4f?w=600&auto=format&fit=crop' },
    { name: 'ቋንጣ ፍርፍር', category: 'ethiopian', price: 373.90, description: 'የሐበሻ ምግብ', image: 'https://images.unsplash.com/photo-1634650947274-0c3fa9d8ee8a?w=600&auto=format&fit=crop' },
    { name: 'ጥብስ ፍርፍር', category: 'ethiopian', price: 359.52, description: 'የሐበሻ ምግብ', image: 'https://images.unsplash.com/photo-1634650947274-0c3fa9d8ee8a?w=600&auto=format&fit=crop' },
    { name: 'ቦዘና ሽሮ', category: 'ethiopian', price: 347.82, description: 'የሐበሻ ምግብ', image: 'https://images.unsplash.com/photo-1634650947274-0c3fa9d8ee8a?w=600&auto=format&fit=crop' },
    { name: 'ሽሮ በቅቤ', category: 'ethiopian', price: 295.65, description: 'የሐበሻ ምግብ', image: 'https://images.unsplash.com/photo-1634650947274-0c3fa9d8ee8a?w=600&auto=format&fit=crop' },
    { name: 'ድርቆሸ ፍርፍር በቅቤ', category: 'ethiopian', price: 321.71, description: 'የሐበሻ ምግብ', image: 'https://images.unsplash.com/photo-1634650947274-0c3fa9d8ee8a?w=600&auto=format&fit=crop' },
    { name: 'ድንች ወጥ በስጋ', category: 'ethiopian', price: 310.43, description: 'የሐበሻ ምግብ', image: 'https://images.unsplash.com/photo-1634650947274-0c3fa9d8ee8a?w=600&auto=format&fit=crop' },
    { name: 'ምስር በስጋ', category: 'ethiopian', price: 347.82, description: 'የሐበሻ ምግብ', image: 'https://images.unsplash.com/photo-1634650947274-0c3fa9d8ee8a?w=600&auto=format&fit=crop' },
    { name: 'ድርቆሸ በቋንጣ ፍርፍር', category: 'ethiopian', price: 365.21, description: 'የሐበሻ ምግብ', image: 'https://images.unsplash.com/photo-1634650947274-0c3fa9d8ee8a?w=600&auto=format&fit=crop' },

    // Ethiopian Food - Half & Half
    { name: 'ጥብስ በሽሮ', category: 'ethiopian_half', price: 434.78, description: 'ግማሽ ግማሽ', image: 'https://images.unsplash.com/photo-1640116345144-8fca02e277b8?w=600&auto=format&fit=crop' },
    { name: 'ቋንጣ ፍርፍር በሸሮ', category: 'ethiopian_half', price: 382.60, description: 'ግማሽ ግማሽ', image: 'https://images.unsplash.com/photo-1640116345144-8fca02e277b8?w=600&auto=format&fit=crop' },
    { name: 'ጥብስ ፍርፍር በሸሮ', category: 'ethiopian_half', price: 426.08, description: 'ግማሽ ግማሽ', image: 'https://images.unsplash.com/photo-1640116345144-8fca02e277b8?w=600&auto=format&fit=crop' },
    { name: 'ድርቆሽ በቋንጣ በበግ ጥብስ', category: 'ethiopian_half', price: 391.30, description: 'ግማሽ ግማሽ', image: 'https://images.unsplash.com/photo-1640116345144-8fca02e277b8?w=600&auto=format&fit=crop' },
    { name: 'ድርቆሽ በቋንጣ በጥብስ ፍርፍር', category: 'ethiopian_half', price: 391.91, description: 'ግማሽ ግማሽ', image: 'https://images.unsplash.com/photo-1640116345144-8fca02e277b8?w=600&auto=format&fit=crop' },
    { name: 'ድርቆሽ በቋንጣ በሽሮ', category: 'ethiopian_half', price: 391.04, description: 'ግማሽ ግማሽ', image: 'https://images.unsplash.com/photo-1640116345144-8fca02e277b8?w=600&auto=format&fit=crop' },
    { name: 'ድርቆሽ በቋንጣ በቦዘና ሽሮ', category: 'ethiopian_half', price: 391.04, description: 'ግማሽ ግማሽ', image: 'https://images.unsplash.com/photo-1640116345144-8fca02e277b8?w=600&auto=format&fit=crop' },
    { name: 'ድርቆሽ በቋንጣ በምስር በስጋ', category: 'ethiopian_half', price: 382.60, description: 'ግማሽ ግማሽ', image: 'https://images.unsplash.com/photo-1640116345144-8fca02e277b8?w=600&auto=format&fit=crop' },
    { name: 'ድርቆሽ በቋንጣ በድንች በስጋ', category: 'ethiopian_half', price: 363.21, description: 'ግማሽ ግማሽ', image: 'https://images.unsplash.com/photo-1640116345144-8fca02e277b8?w=600&auto=format&fit=crop' },
    { name: 'ድርቆሽ በቋንጣ በጭቅና ጥብስ', category: 'ethiopian_half', price: 434.78, description: 'ግማሽ ግማሽ', image: 'https://images.unsplash.com/photo-1640116345144-8fca02e277b8?w=600&auto=format&fit=crop' },
    { name: 'ጭቅና ጥብስ በምስር በስጋ', category: 'ethiopian_half', price: 417.39, description: 'ግማሽ ግማሽ', image: 'https://images.unsplash.com/photo-1640116345144-8fca02e277b8?w=600&auto=format&fit=crop' },
    { name: 'ምስር በስጋ በሽሮ', category: 'ethiopian_half', price: 347.82, description: 'ግማሽ ግማሽ', image: 'https://images.unsplash.com/photo-1640116345144-8fca02e277b8?w=600&auto=format&fit=crop' },
  ]);
  if (menuError) console.error('Menu error:', menuError);
  else console.log('Menu items seeded');

  // Orders
  const { error: orderError } = await supabase.from('orders').insert([
    { id: 'ORD-001', customer: 'John Smith', table_number: '5', items: [{ id: '1', name: 'Macchiato', quantity: 2, price: 95.64, customizations: [] }], total: 191.28, status: 'preparing', notes: '' },
    { id: 'ORD-002', customer: 'Sarah Johnson', table_number: '3', items: [{ id: '2', name: 'Special Pizza', quantity: 1, price: 739.13, customizations: [] }, { id: '3', name: 'Mixed Juice', quantity: 2, price: 173.90, customizations: [] }], total: 1086.93, status: 'ready', notes: '' },
    { id: 'ORD-003', customer: 'Michael Brown', table_number: '8', items: [{ id: '4', name: 'Tiramisu', quantity: 1, price: 260.86, customizations: [] }, { id: '5', name: 'Coffee', quantity: 1, price: 95.65, customizations: [] }], total: 356.51, status: 'served', notes: '' },
    { id: 'ORD-004', customer: 'Emily Davis', table_number: '2', items: [{ id: '6', name: 'Beef Burger', quantity: 1, price: 495.65, customizations: [] }, { id: '7', name: 'French Fries', quantity: 1, price: 265.21, customizations: [] }, { id: '8', name: 'Soft Drinks', quantity: 2, price: 78.25, customizations: [] }], total: 917.36, status: 'confirmed', notes: 'No onions please' },
  ]);
  if (orderError) console.error('Order error:', orderError);
  else console.log('Orders seeded');

  // Tables
  const { error: tableError } = await supabase.from('restaurant_tables').insert([
    { number: '1', capacity: 2, location: 'Main Hall', qr_code: 'https://stnwzgzndyzkesztwxkd.supabase.co/menu/1', status: 'available' },
    { number: '2', capacity: 4, location: 'Main Hall', qr_code: 'https://stnwzgzndyzkesztwxkd.supabase.co/menu/2', status: 'occupied' },
    { number: '3', capacity: 4, location: 'Window', qr_code: 'https://stnwzgzndyzkesztwxkd.supabase.co/menu/3', status: 'occupied' },
    { number: '4', capacity: 6, location: 'Private Room', qr_code: 'https://stnwzgzndyzkesztwxkd.supabase.co/menu/4', status: 'reserved' },
    { number: '5', capacity: 2, location: 'Patio', qr_code: 'https://stnwzgzndyzkesztwxkd.supabase.co/menu/5', status: 'occupied' },
    { number: '6', capacity: 8, location: 'VIP Room', qr_code: 'https://stnwzgzndyzkesztwxkd.supabase.co/menu/6', status: 'available' },
    { number: '7', capacity: 4, location: 'Main Hall', qr_code: 'https://stnwzgzndyzkesztwxkd.supabase.co/menu/7', status: 'available' },
    { number: '8', capacity: 2, location: 'Patio', qr_code: 'https://stnwzgzndyzkesztwxkd.supabase.co/menu/8', status: 'occupied' },
  ]);
  if (tableError) console.error('Table error:', tableError);
  else console.log('Tables seeded');

  // Staff
  const { error: staffError } = await supabase.from('staff').insert([
    { name: 'Alexandre Dubois', email: 'alexandre@luxurydining.com', phone: '+1 234 567 890', role: 'admin', status: 'active' },
    { name: 'Maria Rodriguez', email: 'maria@luxurydining.com', phone: '+1 234 567 891', role: 'manager', status: 'active' },
    { name: 'Pierre Laurent', email: 'pierre@luxurydining.com', phone: '+1 234 567 892', role: 'chef', status: 'active' },
    { name: 'Sophie Chen', email: 'sophie@luxurydining.com', phone: '+1 234 567 893', role: 'waiter', status: 'active' },
    { name: 'James Wilson', email: 'james@luxurydining.com', phone: '+1 234 567 894', role: 'waiter', status: 'active' },
    { name: 'Lisa Anderson', email: 'lisa@luxurydining.com', phone: '+1 234 567 895', role: 'host', status: 'active' },
  ]);
  if (staffError) console.error('Staff error:', staffError);
  else console.log('Staff seeded');

  // Inventory
  const { error: invError } = await supabase.from('inventory').insert([
    { name: 'Wagyu Beef', category: 'meat', quantity: 15, unit: 'kg', min_threshold: 10, cost: 85 },
    { name: 'Lobster Tails', category: 'seafood', quantity: 30, unit: 'pcs', min_threshold: 20, cost: 35 },
    { name: 'Saffron', category: 'spices', quantity: 500, unit: 'g', min_threshold: 100, cost: 12 },
    { name: 'Truffle Oil', category: 'spices', quantity: 8, unit: 'bottles', min_threshold: 5, cost: 45 },
    { name: 'Gold Leaf', category: 'spices', quantity: 50, unit: 'sheets', min_threshold: 20, cost: 30 },
    { name: 'Champagne', category: 'beverages', quantity: 24, unit: 'bottles', min_threshold: 12, cost: 60 },
    { name: 'Foie Gras', category: 'meat', quantity: 5, unit: 'kg', min_threshold: 3, cost: 70 },
    { name: 'Dark Chocolate', category: 'spices', quantity: 10, unit: 'kg', min_threshold: 5, cost: 25 },
  ]);
  if (invError) console.error('Inventory error:', invError);
  else console.log('Inventory seeded');

  // Reviews
  const { error: reviewError } = await supabase.from('reviews').insert([
    { customer: 'Robert K.', rating: 5, comment: 'Absolutely incredible dining experience. The Special Pizza was perfection.', status: 'approved', response: 'Thank you Robert! We look forward to serving you again.' },
    { customer: 'Jennifer L.', rating: 5, comment: 'The ambiance and food were both exceptional. Highly recommend the Grilled Fish.', status: 'approved', response: '' },
    { customer: 'David M.', rating: 4, comment: 'Great service and delicious food. The only minor issue was the wait time.', status: 'pending', response: '' },
    { customer: 'Amanda P.', rating: 5, comment: 'Best dining experience in the city! The Tiramisu was divine.', status: 'approved', response: '' },
  ]);
  if (reviewError) console.error('Review error:', reviewError);
  else console.log('Reviews seeded');

  // Restaurant Settings
  const { error: settingsError } = await supabase.from('restaurant_settings').insert({
    name: 'Bright Restaurant',
    description: 'Experience the finest dining with our diverse menu of Ethiopian and international cuisine',
    address: 'Addis Ababa, Ethiopia',
    phone: '+251 911 234 567',
    email: 'info@brightrestaurant.com',
    website: 'https://brightrestaurant.com',
    opening_hours_weekdays: '8:00 AM - 11:00 PM',
    opening_hours_weekends: '8:00 AM - 12:00 AM',
    logo: '',
    cover_image: '',
  });
  if (settingsError) console.error('Settings error:', settingsError);
  else console.log('Settings seeded');

  console.log('Done!');
}

seed().catch(console.error);
