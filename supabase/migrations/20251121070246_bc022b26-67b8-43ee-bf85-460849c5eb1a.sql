-- Create schedules table to store generated schedules
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_schedule_time FLOAT NOT NULL,
  court_utilization JSONB NOT NULL DEFAULT '{}',
  player_rest_violations TEXT[] DEFAULT ARRAY[]::TEXT[],
  scheduling_conflicts TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create scheduled_matches table to store individual match schedules
CREATE TABLE IF NOT EXISTS public.scheduled_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES public.schedules(id) ON DELETE CASCADE,
  match_data JSONB NOT NULL,
  court_data JSONB NOT NULL,
  scheduled_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  scheduled_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'pending', 'ongoing', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for schedules
CREATE POLICY "Admins can manage schedules"
  ON public.schedules
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view schedules"
  ON public.schedules
  FOR SELECT
  USING (true);

-- RLS Policies for scheduled_matches
CREATE POLICY "Admins can manage scheduled matches"
  ON public.scheduled_matches
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view scheduled matches"
  ON public.scheduled_matches
  FOR SELECT
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_schedules_created_at ON public.schedules(created_at DESC);
CREATE INDEX idx_scheduled_matches_schedule_id ON public.scheduled_matches(schedule_id);
CREATE INDEX idx_scheduled_matches_start_time ON public.scheduled_matches(scheduled_start_time);
CREATE INDEX idx_scheduled_matches_status ON public.scheduled_matches(status);

-- Create trigger to update updated_at
CREATE TRIGGER update_schedules_updated_at
  BEFORE UPDATE ON public.schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();