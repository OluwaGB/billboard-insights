import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { hourlyScans } from "@/lib/mock-data";

const ScanChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="rounded-xl border bg-card p-5 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold font-['Space_Grotesk']">Scan Activity</h3>
          <p className="text-sm text-muted-foreground">Hourly scans & conversions today</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="text-muted-foreground">Scans</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full" style={{ background: "hsl(38, 92%, 55%)" }} />
            <span className="text-muted-foreground">Conversions</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={hourlyScans} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(152, 58%, 42%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(152, 58%, 42%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(38, 92%, 55%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(38, 92%, 55%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 90%)" />
          <XAxis dataKey="hour" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
          <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
          <Tooltip
            contentStyle={{
              borderRadius: "0.5rem",
              border: "1px solid hsl(220, 14%, 90%)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          />
          <Area type="monotone" dataKey="scans" stroke="hsl(152, 58%, 42%)" fill="url(#scanGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="conversions" stroke="hsl(38, 92%, 55%)" fill="url(#convGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ScanChart;
