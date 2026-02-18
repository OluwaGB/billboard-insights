import { useState, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, QrCode, MapPin, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const TRACK_BASE = `https://zyvkzfoxmifjnszteojs.supabase.co/functions/v1/track`;

const QRGenerator = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const { data: billboards, isLoading } = useQuery({
    queryKey: ["billboards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("billboards")
        .select("id, code, name, location")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const selected = billboards?.find((b) => b.id === selectedId);
  const trackUrl = selected ? `${TRACK_BASE}?code=${selected.code}` : "";

  const handleDownload = useCallback(() => {
    const canvas = canvasWrapperRef.current?.querySelector("canvas");
    if (!canvas) return;

    // Create a larger canvas for print quality
    const printCanvas = document.createElement("canvas");
    const size = 1024;
    const padding = 80;
    const totalSize = size + padding * 2;
    printCanvas.width = totalSize;
    printCanvas.height = totalSize + 60;
    const ctx = printCanvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, printCanvas.width, printCanvas.height);
    ctx.drawImage(canvas, padding, padding, size, size);

    // Add billboard code label
    ctx.fillStyle = "#1a1a2e";
    ctx.font = "bold 32px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(selected?.code || "", totalSize / 2, totalSize + 40);

    const link = document.createElement("a");
    link.download = `qr-${selected?.code || "billboard"}.png`;
    link.href = printCanvas.toDataURL("image/png");
    link.click();
    toast.success("QR code downloaded");
  }, [selected]);

  const handleCopyUrl = useCallback(async () => {
    if (!trackUrl) return;
    await navigator.clipboard.writeText(trackUrl);
    setCopied(true);
    toast.success("URL copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }, [trackUrl]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <QrCode className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight font-['Space_Grotesk']">
                QR Generator
              </h1>
              <p className="text-sm text-muted-foreground">
                Generate tracking QR codes for billboards
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border bg-card p-6 shadow-sm"
        >
          <label className="text-sm font-medium text-foreground mb-2 block">
            Select Billboard
          </label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a billboard..." />
              </SelectTrigger>
              <SelectContent>
                {billboards?.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    <span className="font-medium">{b.code}</span>
                    <span className="text-muted-foreground ml-2">
                      — {b.name} ({b.location})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </motion.div>

        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 rounded-xl border bg-card p-6 shadow-sm"
          >
            <div className="flex flex-col items-center gap-6">
              {/* Billboard info */}
              <div className="text-center">
                <h2 className="text-xl font-bold font-['Space_Grotesk']">
                  {selected.name}
                </h2>
                <div className="flex items-center justify-center gap-1.5 mt-1 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="text-sm">{selected.location}</span>
                </div>
                <p className="text-xs font-mono text-muted-foreground mt-1">
                  {selected.code}
                </p>
              </div>

              {/* QR Code */}
              <div
                ref={canvasWrapperRef}
                className="rounded-xl border-2 border-dashed border-border p-6 bg-white"
              >
                <QRCodeCanvas
                  value={trackUrl}
                  size={256}
                  level="H"
                  marginSize={2}
                  imageSettings={{
                    src: "",
                    height: 0,
                    width: 0,
                    excavate: false,
                  }}
                />
              </div>

              {/* URL display */}
              <div className="w-full rounded-lg bg-muted/50 p-3 flex items-center gap-2">
                <code className="text-xs text-muted-foreground flex-1 truncate">
                  {trackUrl}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyUrl}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 w-full">
                <Button onClick={handleDownload} className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Download PNG
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QRGenerator;
