-- Limit project categories to the two public HBI categories and normalize legacy rows.
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_category_check;

UPDATE projects
SET category = 'Island Sweep & Initiatives'
WHERE category IN (
  'Island Sweep',
  'Community Awareness',
  'Community',
  'Awareness',
  'Partnerships'
);

UPDATE projects
SET category = 'Coral Restoration'
WHERE category IN (
  'Research'
);

ALTER TABLE projects
ADD CONSTRAINT projects_category_check
CHECK (
  category IN (
    'Coral Restoration',
    'Island Sweep & Initiatives'
  )
);
