import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useLocationBreakdown } from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";

const LocationChart = () => {
  const { data: locationBreakdown, isLoading } = useLocationBreakdown();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="rounded-xl border bg-card p-5 shadow-sm"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold font-['Space_Grotesk']">Top Locations</h3>
        <p className="text-sm text-muted-foreground">Scans by billboard location</p>
      </div>
      {isLoading ? (
        <Skeleton className="h-[280px] w-full" />
      ) : !locationBreakdown?.length ? (
        <p className="text-center text-muted-foreground py-8">No location data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={locationBreakdown}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 0 }}
          >
            <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 11 }}
              stroke="hsl(220, 10%, 46%)"
              width={130}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "0.5rem",
                border: "1px solid hsl(220, 14%, 90%)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
            <Bar dataKey="scans" radius={[0, 6, 6, 0]}>
              {(locationBreakdown || []).map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};

export default LocationChart;
