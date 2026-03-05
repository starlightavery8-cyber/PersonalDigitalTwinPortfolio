/*
  # Add category and is_milestone to experience table

  ## Summary
  Extends the experience table to support the dual-axis timeline feature.
  Adds a category field (AI_Tech / Architecture / Education) and is_milestone flag
  for visual differentiation of pivot moments in the career narrative.

  ## Changes to experience table
  - `category` (text): 'AI_Tech' | 'Architecture' | 'Education' — determines which axis/track the entry belongs to
  - `is_milestone` (boolean, default false): marks pivot/highlight nodes with a breathing pulse animation

  ## Data Updates
  - Backfills category and is_milestone for all existing experience rows
  - University of Edinburgh gets is_milestone=true (the pivot point from Architecture → AI/Tech)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'experience' AND column_name = 'category'
  ) THEN
    ALTER TABLE experience ADD COLUMN category text NOT NULL DEFAULT 'AI_Tech';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'experience' AND column_name = 'is_milestone'
  ) THEN
    ALTER TABLE experience ADD COLUMN is_milestone boolean NOT NULL DEFAULT false;
  END IF;
END $$;

UPDATE experience SET category = 'AI_Tech', is_milestone = false
  WHERE company = 'Yunie (Shanghai) Technology';

UPDATE experience SET category = 'AI_Tech', is_milestone = false
  WHERE company = 'Su Architect';

UPDATE experience SET category = 'Architecture', is_milestone = false
  WHERE company = 'Aikun (Shanghai) Architecture Design';

UPDATE experience SET category = 'Education', is_milestone = true
  WHERE company = 'University of Edinburgh';

UPDATE experience SET category = 'Education', is_milestone = false
  WHERE company = 'National Taiwan University of Science and Technology';
