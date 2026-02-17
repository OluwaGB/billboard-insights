import { Scan, MousePointerClick, Percent, Megaphone } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiCard from "@/components/dashboard/KpiCard";
import ScanChart from "@/components/dashboard/ScanChart";
import WeeklyChart from "@/components/dashboard/WeeklyChart";
import LocationChart from "@/components/dashboard/LocationChart";
import CampaignTable from "@/components/dashboard/CampaignTable";
import { kpiData } from "@/lib/mock-data";

const kpis = [
  { title: "Total Scans", value: kpiData.totalScans.toLocaleString(), change: kpiData.scansChange, icon: Scan },
  { title: "Conversions", value: kpiData.totalConversions.toLocaleString(), change: kpiData.conversionsChange, icon: MousePointerClick },
  { title: "Avg. CTR", value: `${kpiData.avgCtr}%`, change: kpiData.ctrChange, icon: Percent },
  { title: "Active Campaigns", value: String(kpiData.activeCampaigns), change: kpiData.campaignsChange, icon: Megaphone },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <DashboardHeader />

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi, i) => (
            <KpiCard key={kpi.title} {...kpi} index={i} />
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
