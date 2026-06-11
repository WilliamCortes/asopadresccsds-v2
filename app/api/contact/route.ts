import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(10),
  habeas_data: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const data = ContactSchema.parse({
      name: body.get("name"),
      email: body.get("email"),
      subject: body.get("subject"),
      message: body.get("message"),
      habeas_data: body.get("habeas_data"),
    });

    // Send email via Resend
    const resendKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL ?? "asociaciondepadresdefamilia@ccsds.edu.co";

    if (resendKey) {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);

      await resend.emails.send({
        from: `ASOPADRES CCSDS <${process.env.RESEND_FROM_EMAIL ?? "noreply@asopadresccsds.org"}>`,
        to: [toEmail],
        replyTo: data.email,
        subject: `[Contacto Web] ${data.subject ?? "Mensaje de " + data.name}`,
        html: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.subject ? `<p><strong>Asunto:</strong> ${data.subject}</p>` : ""}
          <p><strong>Mensaje:</strong></p>
          <blockquote>${data.message.replace(/\n/g, "<br>")}</blockquote>
          <hr>
          <p style="color:#888;font-size:12px;">
            Enviado desde el formulario de contacto de asopadresccsds.org
          </p>
        `,
      });
    }

    // Redirect back with success
    return NextResponse.redirect(
      new URL("/es/contactenos?success=true", req.url)
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.redirect(
      new URL("/es/contactenos?error=true", req.url)
    );
  }
}
