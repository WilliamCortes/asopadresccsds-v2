import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const name = body.get("name") as string;
    const id = body.get("id") as string;
    const email = body.get("email") as string;
    const type = body.get("type") as string;
    const description = body.get("description") as string;

    if (!name || !email || !type || !description) {
      return NextResponse.redirect(
        new URL("/es/proteccion-datos?error=true", req.url)
      );
    }

    const toEmail = process.env.CONTACT_EMAIL ?? "asociaciondepadresdefamilia@ccsds.edu.co";
    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);

      await resend.emails.send({
        from: `ASOPADRES CCSDS <${process.env.RESEND_FROM_EMAIL ?? "noreply@asopadresccsds.org"}>`,
        to: [toEmail],
        replyTo: email,
        subject: `[ARCO] Solicitud de ${type} — ${name}`,
        html: `
          <h2>Solicitud de ejercicio de derechos ARCO</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Documento:</strong> ${id}</p>
          <p><strong>Email de respuesta:</strong> ${email}</p>
          <p><strong>Tipo de solicitud:</strong> ${type}</p>
          <p><strong>Descripción:</strong></p>
          <blockquote>${description.replace(/\n/g, "<br>")}</blockquote>
          <hr>
          <p style="color:#888;font-size:12px;">
            <strong>Plazo de respuesta:</strong> 10 días hábiles (consultas) / 15 días hábiles (reclamos)<br>
            Conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013.<br>
            Solicitud recibida el: ${new Date().toLocaleDateString("es-CO")}
          </p>
        `,
      });

      // Confirmation to requestor
      await resend.emails.send({
        from: `ASOPADRES CCSDS <${process.env.RESEND_FROM_EMAIL ?? "noreply@asopadresccsds.org"}>`,
        to: [email],
        subject: "Solicitud ARCO recibida — ASOPADRES CCSDS",
        html: `
          <h2>Hemos recibido tu solicitud</h2>
          <p>Estimado/a ${name},</p>
          <p>Tu solicitud de tipo <strong>${type}</strong> ha sido recibida por ASOPADRES CCSDS.</p>
          <p>Responderemos en un plazo máximo de <strong>15 días hábiles</strong> al correo ${email}.</p>
          <p>Si tienes dudas, puedes escribirnos a asociaciondepadresdefamilia@ccsds.edu.co.</p>
          <hr>
          <p style="color:#888;font-size:12px;">
            ASOPADRES CCSDS · NIT 901.740.513-1<br>
            Política de Tratamiento de Datos: https://asopadresccsds.org/es/proteccion-datos
          </p>
        `,
      });
    }

    return NextResponse.redirect(
      new URL("/es/proteccion-datos?success=true", req.url)
    );
  } catch (error) {
    console.error("ARCO route error:", error);
    return NextResponse.redirect(
      new URL("/es/proteccion-datos?error=true", req.url)
    );
  }
}
