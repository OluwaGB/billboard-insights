import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Simple bot detection based on user-agent
function isBot(ua: string): boolean {
  const botPatterns =
    /bot|crawl|spider|slurp|baidu|yandex|bing|google|facebook|twitter|linkedin|pinterest|semrush|ahref|mj12bot|dotbot|petalbot/i;
  return botPatterns.test(ua);
}

function getDeviceType(ua: string): string {
  if (/mobile|android|iphone|ipod/i.test(ua)) return "mobile";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  return "desktop";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    // Billboard code from query param: /track?code=BB-LG-001
    const code = url.searchParams.get("code");

    if (!code) {
      return new Response(
        JSON.stringify({ error: "Missing billboard code" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Look up billboard
    const { data: billboard, error: bbError } = await supabase
      .from("billboards")
      .select("id")
      .eq("code", code)
      .maybeSingle();

    if (bbError || !billboard) {
      return new Response(
        JSON.stringify({ error: "Billboard not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Find the active campaign on this billboard
    const today = new Date().toISOString().split("T")[0];
    const { data: campaign, error: cmpError } = await supabase
      .from("campaigns")
      .select("id, landing_url")
      .eq("billboard_id", billboard.id)
      .eq("status", "active")
      .lte("start_date", today)
      .gte("end_date", today)
      .limit(1)
      .maybeSingle();

    if (cmpError || !campaign) {
      // No active campaign — redirect to a default page
      return new Response(null, {
        status: 302,
        headers: { ...corsHeaders, Location: "https://adtrackng.com" },
      });
    }

    // Collect scan metadata
    const userAgent = req.headers.get("user-agent") || "";
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    const referer = req.headers.get("referer") || null;
    const bot = isBot(userAgent);
    const deviceType = getDeviceType(userAgent);

    // Log the scan event (non-blocking is fine, but we await to catch errors)
    await supabase.from("scan_events").insert({
      billboard_id: billboard.id,
      campaign_id: campaign.id,
      ip_address: ip,
      user_agent: userAgent,
      referer: referer,
      device_type: deviceType,
      is_bot: bot,
    });

    // Redirect user to advertiser landing page
    return new Response(null, {
      status: 302,
      headers: { ...corsHeaders, Location: campaign.landing_url },
    });
  } catch (err) {
    console.error("Track error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
