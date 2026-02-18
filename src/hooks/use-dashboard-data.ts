import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LiveCampaign {
  id: string;
  name: string;
  billboard_code: string;
  billboard_name: string;
  location: string;
  status: string;
  scans: number;
  conversions: number;
  ctr: number;
  start_date: string;
  end_date: string;
}

export interface HourlyScan {
  hour: string;
  scans: number;
  conversions: number;
}

export interface LocationData {
  name: string;
  scans: number;
  fill: string;
}

export interface WeeklyData {
  day: string;
  scans: number;
  conversions: number;
}

const LOCATION_COLORS = [
  "hsl(152, 58%, 42%)",
  "hsl(217, 91%, 60%)",
  "hsl(38, 92%, 55%)",
  "hsl(270, 60%, 55%)",
  "hsl(0, 72%, 55%)",
  "hsl(190, 70%, 45%)",
  "hsl(330, 65%, 50%)",
];

export function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns-live"],
    queryFn: async (): Promise<LiveCampaign[]> => {
      // Get campaigns with billboard info
      const { data: campaigns, error: cErr } = await supabase
        .from("campaigns")
        .select("id, name, status, start_date, end_date, billboard_id, billboards(code, name, location)");
      if (cErr) throw cErr;

      // Get scan counts per campaign
      const { data: scanCounts, error: sErr } = await supabase
        .from("scan_events")
        .select("campaign_id, converted");
      if (sErr) throw sErr;

      const countMap: Record<string, { scans: number; conversions: number }> = {};
      for (const s of scanCounts || []) {
        if (!countMap[s.campaign_id]) countMap[s.campaign_id] = { scans: 0, conversions: 0 };
        countMap[s.campaign_id].scans++;
        if (s.converted) countMap[s.campaign_id].conversions++;
      }

      return (campaigns || []).map((c: any) => {
        const counts = countMap[c.id] || { scans: 0, conversions: 0 };
        const ctr = counts.scans > 0 ? Math.round((counts.conversions / counts.scans) * 10000) / 100 : 0;
        return {
          id: c.id,
          name: c.name,
          billboard_code: c.billboards?.code || "",
          billboard_name: c.billboards?.name || "",
          location: c.billboards?.location || "",
          status: c.status,
          scans: counts.scans,
          conversions: counts.conversions,
          ctr,
          start_date: c.start_date,
          end_date: c.end_date,
        };
      });
    },
  });
}

export function useKpis() {
  return useQuery({
    queryKey: ["kpis-live"],
    queryFn: async () => {
      const { data, error } = await supabase.from("scan_events").select("converted, scanned_at");
      if (error) throw error;

      const events = data || [];
      const totalScans = events.length;
      const totalConversions = events.filter((e) => e.converted).length;
      const avgCtr = totalScans > 0 ? Math.round((totalConversions / totalScans) * 10000) / 100 : 0;

      const { count: activeCampaigns, error: cErr } = await supabase
        .from("campaigns")
        .select("id", { count: "exact", head: true })
        .eq("status", "active");
      if (cErr) throw cErr;

      return {
        totalScans,
        totalConversions,
        avgCtr,
        activeCampaigns: activeCampaigns || 0,
      };
    },
  });
}

export function useHourlyScans() {
  return useQuery({
    queryKey: ["hourly-scans"],
    queryFn: async (): Promise<HourlyScan[]> => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("scan_events")
        .select("scanned_at, converted")
        .gte("scanned_at", today.toISOString());
      if (error) throw error;

      const hourMap: Record<number, { scans: number; conversions: number }> = {};
      for (let h = 6; h <= 21; h++) hourMap[h] = { scans: 0, conversions: 0 };

      for (const e of data || []) {
        const h = new Date(e.scanned_at).getHours();
        if (hourMap[h]) {
          hourMap[h].scans++;
          if (e.converted) hourMap[h].conversions++;
        }
      }

      return Object.entries(hourMap).map(([h, v]) => {
        const hour = Number(h);
        const label = hour === 0 ? "12AM" : hour < 12 ? `${hour}AM` : hour === 12 ? "12PM" : `${hour - 12}PM`;
        return { hour: label, ...v };
      });
    },
  });
}

export function useWeeklyTrend() {
  return useQuery({
    queryKey: ["weekly-trend"],
    queryFn: async (): Promise<WeeklyData[]> => {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
      startOfWeek.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("scan_events")
        .select("scanned_at, converted")
        .gte("scanned_at", startOfWeek.toISOString());
      if (error) throw error;

      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const dayMap: Record<string, { scans: number; conversions: number }> = {};
      days.forEach((d) => (dayMap[d] = { scans: 0, conversions: 0 }));

      for (const e of data || []) {
        const dayIndex = (new Date(e.scanned_at).getDay() + 6) % 7; // Mon=0
        const day = days[dayIndex];
        dayMap[day].scans++;
        if (e.converted) dayMap[day].conversions++;
      }

      return days.map((d) => ({ day: d, ...dayMap[d] }));
    },
  });
}

export function useLocationBreakdown() {
  return useQuery({
    queryKey: ["location-breakdown"],
    queryFn: async (): Promise<LocationData[]> => {
      const { data, error } = await supabase
        .from("scan_events")
        .select("billboard_id, billboards(location)");
      if (error) throw error;

      const locMap: Record<string, number> = {};
      for (const e of data || []) {
        const loc = (e as any).billboards?.location || "Unknown";
        locMap[loc] = (locMap[loc] || 0) + 1;
      }

      return Object.entries(locMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7)
        .map(([name, scans], i) => ({
          name,
          scans,
          fill: LOCATION_COLORS[i % LOCATION_COLORS.length],
        }));
    },
  });
}
