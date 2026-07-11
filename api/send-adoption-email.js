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
      full_name = '',
      email = '',
      phone = '',
      country = '',
      donor_type = '',
      package_name = '',
      donation_amount = '',
      display_name = '',
      dedication_message = '',
    } = req.body || {};

    if (!full_name || !email || !package_name) {
      return res.status(400).json({
        success: false,
        error: 'Full name, email, and package name are required.',
      });
    }

    const smtpHost = process.env.SMTP_HOST || 'mail.privateemail.com';
    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const smtpSecure = String(process.env.SMTP_SECURE || 'true') === 'true';
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const adoptionTo = process.env.ADOPTION_TO || process.env.CONTACT_TO || smtpUser;
    const adoptionFrom = process.env.CONTACT_FROM || smtpUser;

    if (!smtpUser || !smtpPass || !adoptionTo || !adoptionFrom) {
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

    const subject = `New Adopt a Frame request: ${package_name}`;

    const textBody = `
New Adopt a Frame request

Package:
${package_name}

Contribution:
${donation_amount || 'Not provided'}

Full Name:
${full_name}

Email:
${email}

Phone:
${phone || 'Not provided'}

Country:
${country || 'Not provided'}

Donor Type:
${donor_type || 'Not provided'}

Display Name:
${display_name || 'Not provided'}

Dedication Message:
${dedication_message || 'Not provided'}

Source:
Hinnavaru Blue Initiative website - Adopt a Frame
`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
        <h2 style="color: #003A70;">New Adopt a Frame Request</h2>

        <p><strong>Package:</strong><br />${escapeHtml(package_name)}</p>
        <p><strong>Contribution:</strong><br />${escapeHtml(donation_amount || 'Not provided')}</p>
        <p><strong>Full Name:</strong><br />${escapeHtml(full_name)}</p>
        <p><strong>Email:</strong><br />${escapeHtml(email)}</p>
        <p><strong>Phone:</strong><br />${escapeHtml(phone || 'Not provided')}</p>
        <p><strong>Country:</strong><br />${escapeHtml(country || 'Not provided')}</p>
        <p><strong>Donor Type:</strong><br />${escapeHtml(donor_type || 'Not provided')}</p>
        <p><strong>Display Name:</strong><br />${escapeHtml(display_name || 'Not provided')}</p>
        <p><strong>Dedication Message:</strong><br />${escapeHtml(dedication_message || 'Not provided').replaceAll('\n', '<br />')}</p>

        <hr style="border: 0; border-top: 1px solid #dbeafe; margin: 24px 0;" />

        <p style="font-size: 13px; color: #64748b;">
          Source: Hinnavaru Blue Initiative website - Adopt a Frame
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Hinnavaru Blue Initiative" <${adoptionFrom}>`,
      to: adoptionTo,
      replyTo: email,
      subject,
      text: textBody,
      html: htmlBody,
    });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error('send-adoption-email error:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Adoption email failed to send.',
    });
  }
}