import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function resolvePath(obj: unknown, path: string): string {
  const value = path
    .split(".")
    .reduce<unknown>(
      (acc, key) =>
        acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined,
      obj
    );
  return value === undefined || value === null ? "" : String(value);
}

function safeEqualHex(a: string, b: string): boolean {
  const ba = Buffer.from(a.toLowerCase(), "utf8");
  const bb = Buffer.from(b.toLowerCase(), "utf8");
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

export async function POST(req: NextRequest) {
  try {
    const eventsKey = process.env.WOMPI_EVENTS_KEY;
    if (!eventsKey) {
      console.error("Wompi webhook: WOMPI_EVENTS_KEY not configured");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const body = await req.json();
    const checksum: unknown = body?.signature?.checksum ?? req.headers.get("x-event-checksum");
    const properties: unknown = body?.signature?.properties;
    const timestamp = body?.timestamp;

    if (
      typeof checksum !== "string" || !checksum ||
      !Array.isArray(properties) || properties.length === 0 ||
      !properties.every((p) => typeof p === "string") ||
      timestamp === undefined || timestamp === null
    ) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const concatenated = (properties as string[])
      .map((path) => resolvePath(body.data, path))
      .join("");
    const expected = crypto
      .createHash("sha256")
      .update(`${concatenated}${timestamp}${eventsKey}`)
      .digest("hex");

    const headerChecksum = req.headers.get("x-event-checksum");
    if (
      !safeEqualHex(expected, checksum) ||
      (headerChecksum && !safeEqualHex(expected, headerChecksum))
    ) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    if (body.event !== "transaction.updated") {
      return NextResponse.json({ ok: true });
    }

    const transaction = body.data?.transaction;
    if (!transaction) {
      return NextResponse.json({ ok: true });
    }

    const { createAdminClient } = await import("@/lib/supabase/server");
    const supabase = await createAdminClient();

    // Determine type from reference
    const reference = transaction.reference ?? "";
    const type = reference.startsWith("MBR-") ? "membership" : "donation";

    const amount = transaction.amount_in_cents / 100;
    const status =
      transaction.status === "APPROVED"
        ? "completed"
        : ["DECLINED", "ERROR", "VOIDED"].includes(transaction.status)
        ? "failed"
        : "pending";

    const { data: previous, error: prevError } = await supabase
      .from("donaciones")
      .select("status")
      .eq("gateway_reference", transaction.id)
      .maybeSingle();
    if (prevError) throw prevError;

    // Never downgrade an already completed donation
    if (previous?.status === "completed") {
      return NextResponse.json({ ok: true });
    }

    // Upsert donation record
    const { error: upsertError } = await supabase.from("donaciones").upsert({
      gateway_reference: transaction.id,
      gateway: "wompi",
      amount,
      currency: "COP",
      status,
      type,
      donor_email: transaction.customer_email,
      donor_name: transaction.payment_method?.extra?.name ?? null,
    }, { onConflict: "gateway_reference" });
    if (upsertError) throw upsertError;

    // Update affiliate payment status if membership
    if (type === "membership" && transaction.status === "APPROVED") {
      const affiliateEmail = transaction.customer_email;
      if (affiliateEmail) {
        const { error } = await supabase
          .from("afiliados")
          .update({
            payment_status: "completed",
            wompi_reference: transaction.id,
            payment_amount: amount,
          })
          .eq("email", affiliateEmail);
        if (error) throw error;
      }
    }

    // Update project progress only on first transition to completed
    if (type === "donation" && status === "completed" && previous?.status !== "completed") {
      const { error } = await supabase.rpc("increment_project_progress", {
        p_key: "cancha_cubierta",
        p_amount: amount,
      });
      if (error) throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Wompi webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
