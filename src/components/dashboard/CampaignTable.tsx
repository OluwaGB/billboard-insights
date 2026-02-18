import { motion } from "framer-motion";
import { useCampaigns } from "@/hooks/use-dashboard-data";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  active: "bg-primary/10 text-primary border-primary/20",
  paused: "bg-accent/10 text-accent-foreground border-accent/20",
  completed: "bg-muted text-muted-foreground border-border",
};

const CampaignTable = () => {
  const { data: campaigns, isLoading } = useCampaigns();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="rounded-xl border bg-card shadow-sm"
    >
      <div className="p-5 pb-0">
        <h3 className="text-lg font-semibold font-['Space_Grotesk']">Active Campaigns</h3>
        <p className="text-sm text-muted-foreground">Track performance across all billboard campaigns</p>
      </div>
      <div className="p-5">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !campaigns?.length ? (
          <p className="text-center text-muted-foreground py-8">No campaigns found</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Scans</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
                <TableHead className="text-right">CTR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-xs text-muted-foreground">{campaign.billboard_code}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{campaign.location}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("capitalize", statusStyles[campaign.status])}>
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">{campaign.scans.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-medium">{campaign.conversions.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-medium">{campaign.ctr}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </motion.div>
  );
};

export default CampaignTable;
