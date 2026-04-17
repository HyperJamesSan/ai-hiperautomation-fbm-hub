-- Ideas inbox table for the FBM Hyperautomation Hub
CREATE TABLE public.automation_ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  area TEXT NOT NULL,
  idea TEXT NOT NULL,
  time_estimate TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT name_length CHECK (char_length(name) BETWEEN 1 AND 120),
  CONSTRAINT area_length CHECK (char_length(area) BETWEEN 1 AND 120),
  CONSTRAINT idea_length CHECK (char_length(idea) BETWEEN 5 AND 2000),
  CONSTRAINT time_estimate_values CHECK (time_estimate IN ('<1h','1-3h','3-8h','>8h'))
);

ALTER TABLE public.automation_ideas ENABLE ROW LEVEL SECURITY;

-- Anyone (no auth required) can submit an idea
CREATE POLICY "Anyone can submit an idea"
  ON public.automation_ideas
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No public SELECT/UPDATE/DELETE — ideas are private to the program owner
-- (Owner can read via Supabase dashboard or service role)
