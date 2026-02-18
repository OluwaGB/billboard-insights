import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useWeeklyTrend } from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";

const WeeklyChart = () => {
  const { data: weeklyTrend, isLoading } = useWeeklyTrend();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="rounded-xl border bg-card p-5 shadow-sm"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold font-['Space_Grotesk']">Weekly Trend</h3>
        <p className="text-sm text-muted-foreground">Scans & conversions this week</p>
      </div>
      {isLoading ? (
        <Skeleton className="h-[280px] w-full" />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={weeklyTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 90%)" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
            <Tooltip
              contentStyle={{
                borderRadius: "0.5rem",
                border: "1px solid hsl(220, 14%, 90%)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />
            <Bar dataKey="scans" fill="hsl(152, 58%, 42%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="conversions" fill="hsl(38, 92%, 55%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};

export default WeeklyChart;
