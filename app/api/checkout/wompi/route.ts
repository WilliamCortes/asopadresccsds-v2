import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { amountInCents, currency, reference } = await req.json();

  if (!amountInCents || !currency || !reference) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const integrityKey = process.env.WOMPI_INTEGRITY_KEY;
  const publicKey = process.env.WOMPI_PUBLIC_KEY;
  if (!integrityKey || !publicKey) {
    return NextResponse.json({ error: "Wompi not configured" }, { status: 500 });
  }

  const concatenated = `${reference}${amountInCents}${currency}${integrityKey}`;
  const signature = crypto.createHash("sha256").update(concatenated).digest("hex");

  return NextResponse.json({ signature, publicKey });
}
