
-- Billboards table
CREATE TABLE public.billboards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.billboards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Billboards are publicly readable"
ON public.billboards FOR SELECT USING (true);

-- Campaigns table
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  billboard_id UUID NOT NULL REFERENCES public.billboards(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  landing_url TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campaigns are publicly readable"
ON public.campaigns FOR SELECT USING (true);

-- Scan events table
CREATE TABLE public.scan_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  billboard_id UUID NOT NULL REFERENCES public.billboards(id),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id),
  scanned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  referer TEXT,
  device_type TEXT,
  is_bot BOOLEAN NOT NULL DEFAULT false,
  converted BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE public.scan_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Scan events are publicly insertable"
ON public.scan_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Scan events are publicly readable"
ON public.scan_events FOR SELECT USING (true);

-- Index for fast lookups
CREATE INDEX idx_scan_events_billboard ON public.scan_events(billboard_id);
CREATE INDEX idx_scan_events_campaign ON public.scan_events(campaign_id);
CREATE INDEX idx_scan_events_scanned_at ON public.scan_events(scanned_at);

-- Trigger for updated_at on campaigns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_campaigns_updated_at
BEFORE UPDATE ON public.campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed billboards
INSERT INTO public.billboards (code, name, location) VALUES
('BB-LG-001', 'Third Mainland Bridge Board A', 'Third Mainland Bridge'),
('BB-LG-002', 'Lekki-Epe Board A', 'Lekki-Epe Expressway'),
('BB-AB-001', 'Airport Road Board A', 'Airport Road, Abuja'),
('BB-LG-003', 'Ikorodu Road Board A', 'Ikorodu Road'),
('BB-LG-004', 'Ozumba Mbadiwe Board A', 'Ozumba Mbadiwe Ave'),
('BB-AB-002', 'Wuse Zone 5 Board A', 'Wuse Zone 5, Abuja'),
('BB-LG-005', 'Oshodi Board A', 'Oshodi Interchange'),
('BB-LG-006', 'Marina Board A', 'CMS, Marina');
