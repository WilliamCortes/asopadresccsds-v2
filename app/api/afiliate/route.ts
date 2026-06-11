import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const AffiliateSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  id_number: z.string().optional(),
  student_name: z.string().min(2),
  student_grade: z.string().optional(),
  habeas_data: z.string(), // "on" when checkbox checked
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const data = AffiliateSchema.parse({
      full_name: body.get("full_name"),
      email: body.get("email"),
      phone: body.get("phone"),
      id_number: body.get("id_number"),
      student_name: body.get("student_name"),
      student_grade: body.get("student_grade"),
      habeas_data: body.get("habeas_data") ?? "",
    });

    if (data.habeas_data !== "on") {
      return NextResponse.redirect(
        new URL("/es/afiliate?error=habeas_data", req.url)
      );
    }

    // Save to Supabase
    const { createAdminClient } = await import("@/lib/supabase/server");
    const supabase = await createAdminClient();

    const { error: dbError } = await supabase.from("afiliados").insert({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      id_number: data.id_number,
      student_name: data.student_name,
      student_grade: data.student_grade,
      habeas_data_accepted: true,
      habeas_data_date: new Date().toISOString(),
      payment_status: "pending",
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
    }

    // Send welcome email
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);

      await resend.emails.send({
        from: `ASOPADRES CCSDS <${process.env.RESEND_FROM_EMAIL ?? "noreply@asopadresccsds.org"}>`,
        to: [data.email],
        subject: "¡Bienvenido a ASOPADRES CCSDS!",
        html: `
          <h2>¡Bienvenido, ${data.full_name}!</h2>
          <p>Tu afiliación a la Asociación de Padres de Familia del Colegio Campestre
          Santo Domingo Savio ha sido registrada exitosamente.</p>
          <p><strong>Estudiante registrado:</strong> ${data.student_name} — ${data.student_grade ?? "grado por confirmar"}</p>
          <p>Pronto recibirás información sobre el proceso de pago de la cuota de afiliación.</p>
          <hr>
          <p style="color:#888;font-size:12px;">
            ASOPADRES CCSDS · NIT 901.740.513-1 · Anolaima, Cundinamarca<br>
            asociaciondepadresdefamilia@ccsds.edu.co · +57 315 2252936
          </p>
        `,
      });
    }

    return NextResponse.redirect(
      new URL("/es/afiliate?success=true", req.url)
    );
  } catch (error) {
    console.error("Affiliation form error:", error);
    return NextResponse.redirect(
      new URL("/es/afiliate?error=true", req.url)
    );
  }
}
