import nodemailer from 'nodemailer';

/**
 * Create a reusable SMTP transporter from environment variables.
 *
 * All credentials are read from process.env at runtime,
 * so nothing secret is ever bundled into the client build.
 */
export function createTransporter() {
  const host = process.env.ABDELHAMID_SMTP_HOST;
  const port = Number(process.env.ABDELHAMID_SMTP_PORT || '465');
  const user = process.env.ABDELHAMID_SMTP_USERNAME;
  const pass = process.env.ABDELHAMID_SMTP_PASSWORD;

  if (!host || !user || !pass) {
    throw new Error(
      'Missing SMTP environment variables. ' +
      'Set ABDELHAMID_SMTP_HOST, ABDELHAMID_SMTP_USERNAME, and ABDELHAMID_SMTP_PASSWORD.'
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // SSL for port 465, STARTTLS otherwise
    auth: { user, pass },
  });
}

/** The "from" address for all outgoing mail. */
export function mailFrom(): string {
  return process.env.ABDELHAMID_MAIL_FROM || 'info@abdelhamid.co';
}

/** The "to" address that receives form submissions. */
export function mailTo(): string {
  return process.env.ABDELHAMID_MAIL_TO || 'info@abdelhamid.co';
}
