import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = body.event_type;

    // Only process completed payments
    if (eventType !== "PAYMENT.CAPTURE.COMPLETED") {
      return NextResponse.json({ ok: true });
    }

    const capture = body.resource;
    const amount = parseFloat(capture?.amount?.value ?? "0");
    const currency = capture?.amount?.currency_code ?? "USD";
    const donorEmail = capture?.payer?.email_address;
    const donorName = `${capture?.payer?.name?.given_name ?? ""} ${capture?.payer?.name?.surname ?? ""}`.trim();
    const captureId = capture?.id;

    const { createAdminClient } = await import("@/lib/supabase/server");
    const supabase = await createAdminClient();

    // Record donation
    await supabase.from("donaciones").upsert({
      gateway_reference: captureId,
      gateway: "paypal",
      amount,
      currency: currency as "EUR" | "USD",
      status: "completed",
      type: "donation",
      project: "cancha_cubierta",
      donor_email: donorEmail,
      donor_name: donorName || null,
    }, { onConflict: "gateway_reference" });

    // Update project progress (convert to COP equivalent or track separately)
    // For now, track as-is in foreign currency
    const { data: progress } = await supabase
      .from("proyecto_progreso")
      .select("current_amount")
      .eq("project_key", "cancha_cubierta")
      .single();

    if (progress && currency === "COP") {
      await supabase
        .from("proyecto_progreso")
        .update({
          current_amount: (progress.current_amount ?? 0) + amount,
        })
        .eq("project_key", "cancha_cubierta");
    }

    // Thank you email
    if (donorEmail) {
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        const { Resend } = await import("resend");
        const resend = new Resend(resendKey);

        const locale = currency === "EUR" ? "fr" : "en";
        const subject =
          locale === "fr"
            ? "Merci pour votre soutien — ASOPADRES CCSDS"
            : "Thank you for your support — ASOPADRES CCSDS";

        await resend.emails.send({
          from: `ASOPADRES CCSDS <${process.env.RESEND_FROM_EMAIL}>`,
          to: [donorEmail],
          subject,
          html: `
            <h2>${locale === "fr" ? "Merci" : "Thank you"}, ${donorName || ""}!</h2>
            <p>${locale === "fr"
              ? "Votre contribution de "
              : "Your contribution of "
            } <strong>${amount} ${currency}</strong> ${
              locale === "fr"
                ? "a été reçue. Elle aidera à construire le terrain couvert pour les enfants du Colegio Campestre Santo Domingo Savio."
                : "has been received. It will help build the covered court for the children of Colegio Campestre Santo Domingo Savio."
            }</p>
            <p>${locale === "fr"
              ? "Référence: "
              : "Reference: "
            } <code>${captureId}</code></p>
            <hr>
            <p style="color:#888;font-size:12px;">
              ASOPADRES CCSDS · NIT 901.740.513-1 · Anolaima, Cundinamarca, Colombia<br>
              asociaciondepadresdefamilia@ccsds.edu.co
            </p>
          `,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
