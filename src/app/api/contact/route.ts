import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sanitize = (value: string) => value.replace(/[<>]/g, "").trim();

const renderAdminEmail = (data: ContactPayload) => `
<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:Inter,Arial,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="padding:24px 28px;background:#111827;color:#ffffff;">
                <h1 style="margin:0;font-size:20px;font-weight:600;">New Contact Form Submission</h1>
                <p style="margin:8px 0 0;font-size:13px;color:#e5e7eb;">You received a new message from your website.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;">
                <p style="margin:0 0 12px;font-size:14px;"><strong>Name:</strong> ${data.name}</p>
                <p style="margin:0 0 12px;font-size:14px;"><strong>Email:</strong> ${data.email}</p>
                <p style="margin:0 0 12px;font-size:14px;"><strong>Subject:</strong> ${data.subject}</p>
                <p style="margin:0 0 8px;font-size:14px;"><strong>Message:</strong></p>
                <div style="padding:14px;border:1px solid #e5e7eb;border-radius:10px;background:#f9fafb;font-size:14px;line-height:1.55;white-space:pre-wrap;">${data.message}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

const renderUserEmail = (data: ContactPayload) => `
<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:Inter,Arial,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="padding:26px 28px;background:#111827;color:#ffffff;">
                <h1 style="margin:0;font-size:22px;font-weight:600;">Thank You for Reaching Out, ${data.name}!</h1>
                <p style="margin:10px 0 0;font-size:14px;color:#e5e7eb;line-height:1.5;">Your message has been received. I’ll review it and get back to you as soon as possible.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;">
                <p style="margin:0 0 14px;font-size:14px;line-height:1.6;">I appreciate your time and interest. Here is a quick copy of what you submitted:</p>
                <div style="border:1px solid #e5e7eb;border-radius:10px;padding:16px;background:#f9fafb;">
                  <p style="margin:0 0 8px;font-size:14px;"><strong>Subject:</strong> ${data.subject}</p>
                  <p style="margin:0;font-size:14px;line-height:1.55;white-space:pre-wrap;">${data.message}</p>
                </div>
                <p style="margin:18px 0 0;font-size:14px;line-height:1.6;">Warm regards,<br /><strong>Isaiah Calibre</strong></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ContactPayload>;

    const name = sanitize(body.name ?? "");
    const email = sanitize(body.email ?? "").toLowerCase();
    const subject = sanitize(body.subject ?? "");
    const message = sanitize(body.message ?? "");

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT ?? 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFromEmail = process.env.SMTP_FROM_EMAIL;
    const smtpFromName = process.env.SMTP_FROM_NAME ?? "Isaiah Calibre";
    const adminEmail = process.env.CONTACT_ADMIN_EMAIL;

    if (
      !smtpHost ||
      !smtpPort ||
      !smtpUser ||
      !smtpPass ||
      !smtpFromEmail ||
      !adminEmail
    ) {
      return NextResponse.json(
        { error: "Email service is not configured on the server." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await Promise.all([
      transporter.sendMail({
        from: `${smtpFromName} <${smtpFromEmail}>`,
        to: adminEmail,
        replyTo: email,
        subject: `New Contact Form: ${subject}`,
        text: `You received a new contact form submission.\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
        html: renderAdminEmail({ name, email, subject, message }),
      }),
      transporter.sendMail({
        from: `${smtpFromName} <${smtpFromEmail}>`,
        to: email,
        subject: "Thanks for contacting Isaiah Calibre",
        text: `Hi ${name},\n\nThanks for reaching out. I received your message and will get back to you as soon as possible.\n\nSubject: ${subject}\nMessage: ${message}\n\nBest,\nIsaiah Calibre`,
        html: renderUserEmail({ name, email, subject, message }),
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form submission failed:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again shortly." },
      { status: 500 }
    );
  }
}
