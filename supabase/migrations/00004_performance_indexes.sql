-- Add indexes to improve sorting and filtering performance

-- Index for sorting orders by creation time
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);

-- Index for sorting reviews by date
CREATE INDEX IF NOT EXISTS idx_reviews_date ON reviews (date DESC);

-- Index for filtering menu items by category
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items (category);
