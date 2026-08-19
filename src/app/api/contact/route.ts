import { NextResponse } from 'next/server';
import { createTransporter, mailFrom, mailTo } from '@/lib/smtp';

/**
 * POST /api/contact
 *
 * Receives the contact form submission, validates it,
 * and sends an email via SMTP.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      full_name,
      company_name,
      email,
      phone,
      subject,
      message,
      website, // honeypot
    } = body;

    /* ── Honeypot spam check ── */
    if (website) {
      // Bots fill the hidden field; silently succeed to avoid retries.
      return NextResponse.json({ ok: true });
    }

    /* ── Required field validation ── */
    if (!full_name || !email || !subject || !message) {
      return NextResponse.json(
        { ok: false, error: 'Please fill in all required fields.' },
        { status: 400 },
      );
    }

    /* ── Compose email ── */
    const htmlBody = `
      <h2>New Contact Form Submission</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px;font-family:Arial,sans-serif;">
        <tr>
          <td style="padding:10px 14px;border:1px solid #ddd;font-weight:bold;width:140px;">Name</td>
          <td style="padding:10px 14px;border:1px solid #ddd;">${escapeHtml(full_name)}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;border:1px solid #ddd;font-weight:bold;">Company</td>
          <td style="padding:10px 14px;border:1px solid #ddd;">${escapeHtml(company_name || '—')}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;border:1px solid #ddd;font-weight:bold;">Email</td>
          <td style="padding:10px 14px;border:1px solid #ddd;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
        </tr>
        <tr>
          <td style="padding:10px 14px;border:1px solid #ddd;font-weight:bold;">Phone</td>
          <td style="padding:10px 14px;border:1px solid #ddd;">${escapeHtml(phone || '—')}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;border:1px solid #ddd;font-weight:bold;">Subject</td>
          <td style="padding:10px 14px;border:1px solid #ddd;">${escapeHtml(subject)}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;border:1px solid #ddd;font-weight:bold;vertical-align:top;">Message</td>
          <td style="padding:10px 14px;border:1px solid #ddd;white-space:pre-wrap;">${escapeHtml(message)}</td>
        </tr>
      </table>
    `;

    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Abdelhamid Website" <${mailFrom()}>`,
      to: mailTo(),
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: htmlBody,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json(
      { ok: false, error: 'Failed to send message. Please try again later.' },
      { status: 500 },
    );
  }
}

/** Prevent XSS in the HTML email body. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
