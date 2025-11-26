-- ============================================================================
-- FAQ TABLES
-- ============================================================================
-- This migration creates tables for managing FAQ content in the database

-- FAQ Categories table
CREATE TABLE faq_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL, -- emoji or icon identifier
  slug TEXT UNIQUE NOT NULL, -- URL-friendly identifier
  display_order INT NOT NULL DEFAULT 0, -- for ordering categories
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- FAQ Questions table
CREATE TABLE faq_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES faq_categories(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  slug TEXT NOT NULL, -- URL-friendly identifier for deep linking
  display_order INT NOT NULL DEFAULT 0, -- for ordering questions within category
  is_active BOOLEAN NOT NULL DEFAULT true,
  view_count INT NOT NULL DEFAULT 0, -- track popular questions
  helpful_count INT NOT NULL DEFAULT 0, -- positive votes
  not_helpful_count INT NOT NULL DEFAULT 0, -- negative votes
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(category_id, slug)
);

-- Create indexes for better query performance
CREATE INDEX idx_faq_categories_active ON faq_categories(is_active, display_order);
CREATE INDEX idx_faq_questions_category ON faq_questions(category_id, display_order);
CREATE INDEX idx_faq_questions_active ON faq_questions(is_active);
CREATE INDEX idx_faq_questions_slug ON faq_questions(slug);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_faq_categories_updated_at
  BEFORE UPDATE ON faq_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faq_questions_updated_at
  BEFORE UPDATE ON faq_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS (Row Level Security) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_questions ENABLE ROW LEVEL SECURITY;

-- Public read access to active FAQs
CREATE POLICY "Anyone can view active FAQ categories"
  ON faq_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active FAQ questions"
  ON faq_questions FOR SELECT
  USING (is_active = true);

-- Admin full access
CREATE POLICY "Admins can manage FAQ categories"
  ON faq_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage FAQ questions"
  ON faq_questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Grant permissions
GRANT SELECT ON faq_categories TO anon, authenticated;
GRANT SELECT ON faq_questions TO anon, authenticated;
GRANT ALL ON faq_categories TO authenticated;
GRANT ALL ON faq_questions TO authenticated;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_faq_view(question_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE faq_questions
  SET view_count = view_count + 1
  WHERE id = question_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record helpful vote
CREATE OR REPLACE FUNCTION vote_faq_helpful(question_id UUID, is_helpful BOOLEAN)
RETURNS void AS $$
BEGIN
  IF is_helpful THEN
    UPDATE faq_questions
    SET helpful_count = helpful_count + 1
    WHERE id = question_id;
  ELSE
    UPDATE faq_questions
    SET not_helpful_count = not_helpful_count + 1
    WHERE id = question_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE faq_categories IS 'FAQ categories with ordering and active status';
COMMENT ON TABLE faq_questions IS 'FAQ questions with answers, voting, and view tracking';
COMMENT ON FUNCTION increment_faq_view IS 'Increments view count for analytics';
COMMENT ON FUNCTION vote_faq_helpful IS 'Records user feedback on FAQ helpfulness';

