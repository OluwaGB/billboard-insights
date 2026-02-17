export interface Campaign {
  id: string;
  name: string;
  billboard: string;
  location: string;
  status: "active" | "paused" | "completed";
  scans: number;
  conversions: number;
  ctr: number;
  startDate: string;
  endDate: string;
}

export interface ScanEvent {
  hour: string;
  scans: number;
  conversions: number;
}

export interface LocationData {
  name: string;
  scans: number;
  fill: string;
}

export const kpiData = {
  totalScans: 48_392,
  scansChange: 12.5,
  totalConversions: 3_217,
  conversionsChange: 8.3,
  avgCtr: 6.65,
  ctrChange: -1.2,
  activeCampaigns: 24,
  campaignsChange: 4,
};

export const campaigns: Campaign[] = [
  { id: "1", name: "GTBank Savings Promo", billboard: "BB-LG-001", location: "Third Mainland Bridge", status: "active", scans: 8420, conversions: 612, ctr: 7.27, startDate: "2026-01-15", endDate: "2026-03-15" },
  { id: "2", name: "MTN 5G Launch", billboard: "BB-LG-002", location: "Lekki-Epe Expressway", status: "active", scans: 6310, conversions: 489, ctr: 7.75, startDate: "2026-01-20", endDate: "2026-04-20" },
  { id: "3", name: "Dangote Cement – Build Strong", billboard: "BB-AB-001", location: "Airport Road, Abuja", status: "active", scans: 5840, conversions: 327, ctr: 5.6, startDate: "2026-02-01", endDate: "2026-04-30" },
  { id: "4", name: "Coca-Cola Refresh", billboard: "BB-LG-003", location: "Ikorodu Road", status: "paused", scans: 4220, conversions: 298, ctr: 7.06, startDate: "2025-12-01", endDate: "2026-02-28" },
  { id: "5", name: "Access Bank DigiSave", billboard: "BB-LG-004", location: "Ozumba Mbadiwe Ave", status: "active", scans: 3980, conversions: 256, ctr: 6.43, startDate: "2026-02-05", endDate: "2026-05-05" },
  { id: "6", name: "Glo Unlimited Data", billboard: "BB-AB-002", location: "Wuse Zone 5, Abuja", status: "completed", scans: 7150, conversions: 410, ctr: 5.73, startDate: "2025-11-01", endDate: "2026-01-31" },
  { id: "7", name: "Indomie 40th Anniversary", billboard: "BB-LG-005", location: "Oshodi Interchange", status: "active", scans: 5600, conversions: 380, ctr: 6.79, startDate: "2026-01-10", endDate: "2026-03-10" },
  { id: "8", name: "Peak Milk – Stay Strong", billboard: "BB-LG-006", location: "CMS, Marina", status: "active", scans: 3200, conversions: 195, ctr: 6.09, startDate: "2026-02-10", endDate: "2026-04-10" },
];

export const hourlyScans: ScanEvent[] = [
  { hour: "6AM", scans: 120, conversions: 8 },
  { hour: "7AM", scans: 450, conversions: 28 },
  { hour: "8AM", scans: 890, conversions: 62 },
  { hour: "9AM", scans: 720, conversions: 48 },
  { hour: "10AM", scans: 540, conversions: 35 },
  { hour: "11AM", scans: 480, conversions: 30 },
  { hour: "12PM", scans: 620, conversions: 42 },
  { hour: "1PM", scans: 580, conversions: 38 },
  { hour: "2PM", scans: 510, conversions: 32 },
  { hour: "3PM", scans: 640, conversions: 45 },
  { hour: "4PM", scans: 780, conversions: 55 },
  { hour: "5PM", scans: 950, conversions: 68 },
  { hour: "6PM", scans: 1100, conversions: 78 },
  { hour: "7PM", scans: 870, conversions: 58 },
  { hour: "8PM", scans: 620, conversions: 40 },
  { hour: "9PM", scans: 380, conversions: 22 },
];

export const locationBreakdown: LocationData[] = [
  { name: "Third Mainland Bridge", scans: 8420, fill: "hsl(152, 58%, 42%)" },
  { name: "Lekki-Epe Expressway", scans: 6310, fill: "hsl(217, 91%, 60%)" },
  { name: "Airport Rd, Abuja", scans: 5840, fill: "hsl(38, 92%, 55%)" },
  { name: "Ikorodu Road", scans: 4220, fill: "hsl(270, 60%, 55%)" },
  { name: "Oshodi Interchange", scans: 5600, fill: "hsl(0, 72%, 55%)" },
];

export const weeklyTrend = [
  { day: "Mon", scans: 6200, conversions: 420 },
  { day: "Tue", scans: 5800, conversions: 390 },
  { day: "Wed", scans: 7100, conversions: 510 },
  { day: "Thu", scans: 6900, conversions: 480 },
  { day: "Fri", scans: 8200, conversions: 590 },
  { day: "Sat", scans: 4500, conversions: 310 },
  { day: "Sun", scans: 3200, conversions: 220 },
];
