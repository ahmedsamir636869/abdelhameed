import { NextResponse } from 'next/server';
import { createTransporter, mailFrom, mailTo } from '@/lib/smtp';

/**
 * POST /api/quote
 *
 * Receives the quote form submission (with optional file uploads),
 * validates it, and sends an email via SMTP with attachments.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name         = formData.get('name') as string | null;
    const company      = formData.get('company') as string | null;
    const email        = formData.get('email') as string | null;
    const phone        = formData.get('phone') as string | null;
    const project      = formData.get('project') as string | null;
    const requirements = formData.get('requirements') as string | null;
    const website      = formData.get('website') as string | null; // honeypot

    /* ── Honeypot spam check ── */
    if (website) {
      return NextResponse.json({ ok: true });
    }

    /* ── Required field validation ── */
    if (!name || !email || !project || !requirements) {
      return NextResponse.json(
        { ok: false, error: 'Please fill in all required fields.' },
        { status: 400 },
      );
    }

    /* ── Collect file attachments ── */
    const files = formData.getAll('files[]') as File[];
    const attachments = [];

    for (const file of files) {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        attachments.push({
          filename: file.name,
          content: buffer,
          contentType: file.type || 'application/octet-stream',
        });
      }
    }

    /* ── Compose email ── */
    const htmlBody = `
      <h2>New Quote Request</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px;font-family:Arial,sans-serif;">
        <tr>
          <td style="padding:10px 14px;border:1px solid #ddd;font-weight:bold;width:160px;">Name</td>
          <td style="padding:10px 14px;border:1px solid #ddd;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;border:1px solid #ddd;font-weight:bold;">Company</td>
          <td style="padding:10px 14px;border:1px solid #ddd;">${escapeHtml(company || '—')}</td>
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
          <td style="padding:10px 14px;border:1px solid #ddd;font-weight:bold;">Project / Product</td>
          <td style="padding:10px 14px;border:1px solid #ddd;">${escapeHtml(project)}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;border:1px solid #ddd;font-weight:bold;vertical-align:top;">Requirements</td>
          <td style="padding:10px 14px;border:1px solid #ddd;white-space:pre-wrap;">${escapeHtml(requirements)}</td>
        </tr>
        ${attachments.length > 0 ? `
        <tr>
          <td style="padding:10px 14px;border:1px solid #ddd;font-weight:bold;">Attachments</td>
          <td style="padding:10px 14px;border:1px solid #ddd;">${attachments.length} file(s) attached</td>
        </tr>
        ` : ''}
      </table>
    `;

    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Abdelhamid Website" <${mailFrom()}>`,
      to: mailTo(),
      replyTo: email,
      subject: `[Quote Request] ${project}`,
      html: htmlBody,
      attachments,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Quote form error:', err);
    return NextResponse.json(
      { ok: false, error: 'Failed to send request. Please try again later.' },
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
