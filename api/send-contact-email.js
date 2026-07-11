import nodemailer from 'nodemailer';

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const {
      name = '',
      email = '',
      phone = '',
      subject = '',
      message = '',
    } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required.',
      });
    }

    const smtpHost = process.env.SMTP_HOST || 'mail.privateemail.com';
    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const smtpSecure = String(process.env.SMTP_SECURE || 'true') === 'true';
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const contactTo = process.env.CONTACT_TO || smtpUser;
    const contactFrom = process.env.CONTACT_FROM || smtpUser;

    if (!smtpUser || !smtpPass || !contactTo || !contactFrom) {
      return res.status(500).json({
        success: false,
        error: 'SMTP environment variables are missing.',
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const emailSubject = subject
      ? `New website contact message: ${subject}`
      : 'New website contact message - Hinnavaru Blue Initiative';

    const textBody = `
New contact form submission

Name:
${name}

Email:
${email}

Phone:
${phone || 'Not provided'}

Subject:
${subject || 'Not provided'}

Message:
${message}

Source:
Hinnavaru Blue Initiative website
`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
        <h2 style="color: #003A70;">New Contact Form Submission</h2>

        <p><strong>Name:</strong><br />${escapeHtml(name)}</p>
        <p><strong>Email:</strong><br />${escapeHtml(email)}</p>
        <p><strong>Phone:</strong><br />${escapeHtml(phone || 'Not provided')}</p>
        <p><strong>Subject:</strong><br />${escapeHtml(subject || 'Not provided')}</p>

        <p><strong>Message:</strong><br />${escapeHtml(message).replaceAll('\n', '<br />')}</p>

        <hr style="border: 0; border-top: 1px solid #dbeafe; margin: 24px 0;" />

        <p style="font-size: 13px; color: #64748b;">
          Source: Hinnavaru Blue Initiative website
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Hinnavaru Blue Initiative" <${contactFrom}>`,
      to: contactTo,
      replyTo: email,
      subject: emailSubject,
      text: textBody,
      html: htmlBody,
    });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error('send-contact-email error:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Email failed to send.',
    });
  }
}