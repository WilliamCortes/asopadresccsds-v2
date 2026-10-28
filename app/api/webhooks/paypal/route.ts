import { NextRequest, NextResponse } from "next/server";

const PAYPAL_BASE =
  process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function verifyPayPalWebhook(req: NextRequest, event: unknown): Promise<boolean | null> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!clientId || !secret || !webhookId) return null;

  const h = (name: string) => req.headers.get(name);
  const transmissionId = h("paypal-transmission-id");
  const transmissionTime = h("paypal-transmission-time");
  const transmissionSig = h("paypal-transmission-sig");
  const certUrl = h("paypal-cert-url");
  const authAlgo = h("paypal-auth-algo");
  if (!transmissionId || !transmissionTime || !transmissionSig || !certUrl || !authAlgo) {
    return false;
  }

  const tokenRes = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!tokenRes.ok) throw new Error(`PayPal token error ${tokenRes.status}`);
  const { access_token } = await tokenRes.json();

  const verifyRes = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: event,
    }),
  });
  if (!verifyRes.ok) throw new Error(`PayPal verify error ${verifyRes.status}`);
  const { verification_status } = await verifyRes.json();
  return verification_status === "SUCCESS";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const verified = await verifyPayPalWebhook(req, body);
    if (verified === null) {
      console.error("PayPal webhook: missing PAYPAL_* env configuration");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }
    if (!verified) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

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

    const { data: previous, error: prevError } = await supabase
      .from("donaciones")
      .select("status")
      .eq("gateway_reference", captureId)
      .maybeSingle();
    if (prevError) throw prevError;

    // Already completed or refunded: a late retry must not overwrite it
    if (previous?.status === "completed" || previous?.status === "refunded") {
      return NextResponse.json({ ok: true });
    }

    // Record donation
    const { error: upsertError } = await supabase.from("donaciones").upsert({
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
    if (upsertError) throw upsertError;

    // Project progress only tracks COP; increment once on first completion
    if (currency === "COP" && previous?.status !== "completed") {
      const { error } = await supabase.rpc("increment_project_progress", {
        p_key: "cancha_cubierta",
        p_amount: amount,
      });
      if (error) throw error;
    }

    // Email failures must not affect the webhook ACK
    try {
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
    } catch (emailError) {
      console.error("PayPal webhook: email send failed", emailError instanceof Error ? emailError.message : "unknown");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
