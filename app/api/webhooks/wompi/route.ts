import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const signature = req.headers.get("x-event-checksum");

    // Verify Wompi signature
    const eventsKey = process.env.WOMPI_EVENTS_KEY;
    if (eventsKey && signature) {
      const properties = body.event?.data?.transaction;
      const checkString = `${properties?.id}${properties?.status}${properties?.amount_in_cents}${properties?.currency}${eventsKey}`;
      const expected = crypto
        .createHash("sha256")
        .update(checkString)
        .digest("hex");

      if (expected !== signature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    // Process transaction
    const transaction = body.event?.data?.transaction;
    if (!transaction) {
      return NextResponse.json({ ok: true });
    }

    const { createAdminClient } = await import("@/lib/supabase/server");
    const supabase = await createAdminClient();

    // Determine type from reference
    const reference = transaction.reference ?? "";
    const type = reference.startsWith("MBR-") ? "membership" : "donation";

    // Upsert donation record
    await supabase.from("donaciones").upsert({
      gateway_reference: transaction.id,
      gateway: "wompi",
      amount: transaction.amount_in_cents / 100,
      currency: "COP",
      status:
        transaction.status === "APPROVED"
          ? "completed"
          : transaction.status === "DECLINED"
          ? "failed"
          : "pending",
      type,
      donor_email: transaction.customer_email,
      donor_name: transaction.payment_method?.extra?.name ?? null,
    }, { onConflict: "gateway_reference" });

    // Update affiliate payment status if membership
    if (type === "membership" && transaction.status === "APPROVED") {
      const affiliateEmail = transaction.customer_email;
      if (affiliateEmail) {
        await supabase
          .from("afiliados")
          .update({
            payment_status: "completed",
            wompi_reference: transaction.id,
            payment_amount: transaction.amount_in_cents / 100,
          })
          .eq("email", affiliateEmail);
      }
    }

    // Update project progress if donation
    if (type === "donation" && transaction.status === "APPROVED") {
      const { data: progress } = await supabase
        .from("proyecto_progreso")
        .select("current_amount")
        .eq("project_key", "cancha_cubierta")
        .single();

      if (progress) {
        await supabase
          .from("proyecto_progreso")
          .update({
            current_amount:
              (progress.current_amount ?? 0) + transaction.amount_in_cents / 100,
          })
          .eq("project_key", "cancha_cubierta");
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Wompi webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
