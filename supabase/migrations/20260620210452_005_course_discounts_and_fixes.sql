-- Aggiunge campi sconti/agevolazioni al corso
-- Fix: default durations a 1 settimana
-- Rimuove tabella course_weeks se vuota e la ricrea con prezzi dinamici

ALTER TABLE courses 
  ADD COLUMN IF NOT EXISTS discount_family_2nd decimal(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_family_3rd decimal(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_member decimal(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_isee decimal(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_large_family decimal(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS installment_months int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS day_start_time text DEFAULT '10:00',
  ADD COLUMN IF NOT EXISTS day_end_time text DEFAULT '17:00',
  ADD COLUMN IF NOT EXISTS campus_nights int DEFAULT 5,
  ADD COLUMN IF NOT EXISTS campus_checkin text DEFAULT 'Domenica 18:00',
  ADD COLUMN IF NOT EXISTS campus_checkout text DEFAULT 'Venerdì 17:30',
  ADD COLUMN IF NOT EXISTS day_friday_end text DEFAULT '17:30',
  ADD COLUMN IF NOT EXISTS schedule_blocks jsonb DEFAULT NULL;

-- Drop e ricrea course_weeks se necessario per i prezzi
-- I prezzi saranno sempre derivati da course.price_day e course.price_campus
-- e non più memorizzati in course_weeks

ALTER TABLE course_weeks 
  DROP COLUMN IF EXISTS price_day,
  DROP COLUMN IF EXISTS price_campus;

-- Rimuovi pagina Costi e Agevolazioni dalla site_pages
DELETE FROM site_pages WHERE slug = 'costi-e-agevolazioni';
