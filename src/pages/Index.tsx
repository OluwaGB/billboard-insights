import { Scan, MousePointerClick, Percent, Megaphone } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiCard from "@/components/dashboard/KpiCard";
import ScanChart from "@/components/dashboard/ScanChart";
import WeeklyChart from "@/components/dashboard/WeeklyChart";
import LocationChart from "@/components/dashboard/LocationChart";
import CampaignTable from "@/components/dashboard/CampaignTable";
import { useKpis } from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";

const kpiConfig = [
  { key: "totalScans" as const, title: "Total Scans", icon: Scan, format: (v: number) => v.toLocaleString() },
  { key: "totalConversions" as const, title: "Conversions", icon: MousePointerClick, format: (v: number) => v.toLocaleString() },
  { key: "avgCtr" as const, title: "Avg. CTR", icon: Percent, format: (v: number) => `${v}%` },
  { key: "activeCampaigns" as const, title: "Active Campaigns", icon: Megaphone, format: (v: number) => String(v) },
];

const Index = () => {
  const { data: kpis, isLoading } = useKpis();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <DashboardHeader />

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[120px] rounded-xl" />
              ))
            : kpiConfig.map((cfg, i) => (
                <KpiCard
                  key={cfg.key}
                  title={cfg.title}
                  value={cfg.format(kpis?.[cfg.key] ?? 0)}
                  change={0}
                  icon={cfg.icon}
                  index={i}
                />
              ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ScanChart />
          <WeeklyChart />
        </div>

        <div className="mt-6">
          <LocationChart />
        </div>

        <div className="mt-6 mb-10">
          <CampaignTable />
        </div>
      </div>
    </div>
  );
};

export default Index;
