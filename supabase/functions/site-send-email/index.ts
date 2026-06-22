import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    return new Response(
      JSON.stringify({ error: "Email not configured yet" }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json();
    const { type, name, email, phone, message, building, unit, _honeypot } = body;

    if (_honeypot) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, email, and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let recipient = "hello@auranewyork.com";
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, serviceRoleKey);
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "contact_recipient")
        .maybeSingle();
      if (data?.value) recipient = String(data.value);
    } catch {}

    let subject = `New ${type || "contact"} inquiry from ${name}`;
    let htmlBody = `<h2>${type === "landlord" ? "Landlord Inquiry" : type === "unit" ? "Unit Inquiry" : "Contact Form"}</h2>`;
    htmlBody += `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`;
    htmlBody += `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`;
    if (phone) htmlBody += `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>`;
    if (building) htmlBody += `<p><strong>Building:</strong> ${escapeHtml(building)}</p>`;
    if (unit) htmlBody += `<p><strong>Unit:</strong> ${escapeHtml(unit)}</p>`;
    htmlBody += `<p><strong>Message:</strong></p><p>${escapeHtml(message)}</p>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Aura New York <hello@auranewyork.com>",
        to: [recipient],
        reply_to: email,
        subject,
        html: htmlBody,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
