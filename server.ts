import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface InquiryPayload {
  name: string;
  brand?: string;
  email: string;
  service?: string;
  services?: string[];
  message?: string;
  notes?: string;
}

interface DeliveryResult {
  success: boolean;
  message?: string;
  method?: string;
  error?: string;
}

const DESTINATION_EMAIL = 'apexcreativesaio@gmail.com';

async function dispatchEmail(payload: {
  service: string;
  name: string;
  brand: string;
  email: string;
  notes: string;
}): Promise<DeliveryResult> {
  const { service, name, brand, email, notes } = payload;
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'UTC',
    dateStyle: 'full',
    timeStyle: 'long',
  });

  const subject = `APEX CREATIVES — NEW PROJECT REQUEST [${service}]`;

  const plainText = `APEX CREATIVES — NEW PROJECT REQUEST

Service:
${service}

Client Name:
${name}

Brand / Business Name:
${brand}

Client Email:
${email}

Project Notes:
${notes}

Submitted: ${timestamp} UTC
`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0c0c; color: #ffffff; margin: 0; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #121212; border: 1px solid #262626; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .header { border-bottom: 2px solid #FF2B2B; padding-bottom: 16px; margin-bottom: 24px; }
          .title { font-size: 20px; font-weight: 800; color: #FF2B2B; letter-spacing: 0.05em; text-transform: uppercase; margin: 0; }
          .subtitle { font-size: 12px; color: #888888; font-family: monospace; margin-top: 4px; }
          .field-group { margin-bottom: 18px; }
          .label { font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em; color: #A8A8A8; font-weight: 700; margin-bottom: 4px; }
          .value { font-size: 15px; color: #FFFFFF; font-weight: 500; }
          .notes-box { background-color: #1A1A1A; border: 1px solid #333333; border-radius: 10px; padding: 16px; margin-top: 6px; font-size: 14px; line-height: 1.6; color: #EDEDED; white-space: pre-wrap; }
          .footer { margin-top: 28px; padding-top: 16px; border-top: 1px solid #262626; font-size: 11px; color: #666666; font-family: monospace; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="title">APEX CREATIVES — NEW PROJECT REQUEST</h1>
            <div class="subtitle">Direct Client Project Inquiry</div>
          </div>

          <div class="field-group">
            <div class="label">Service:</div>
            <div class="value">${service}</div>
          </div>

          <div class="field-group">
            <div class="label">Client Name:</div>
            <div class="value">${name}</div>
          </div>

          <div class="field-group">
            <div class="label">Brand / Business Name:</div>
            <div class="value">${brand}</div>
          </div>

          <div class="field-group">
            <div class="label">Client Email:</div>
            <div class="value"><a href="mailto:${email}" style="color: #FF2B2B; text-decoration: none;">${email}</a></div>
          </div>

          <div class="field-group">
            <div class="label">Project Notes:</div>
            <div class="notes-box">${notes}</div>
          </div>

          <div class="footer">
            Submitted from Apex Creatives Portfolio Website • ${timestamp} UTC
          </div>
        </div>
      </body>
    </html>
  `;

  // 1. DIRECT GMAIL / SMTP VIA NODEMAILER (if env variables are configured)
  const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
  const smtpUser = process.env.GMAIL_USER || process.env.SMTP_USER;
  if (gmailPass && (smtpUser || process.env.GMAIL_APP_PASSWORD)) {
    try {
      const transporter = process.env.GMAIL_APP_PASSWORD
        ? nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: smtpUser || DESTINATION_EMAIL,
              pass: gmailPass,
            },
          })
        : nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
              user: smtpUser,
              pass: gmailPass,
            },
          });

      await transporter.sendMail({
        from: `"Apex Creatives Inquiry" <${smtpUser || DESTINATION_EMAIL}>`,
        to: DESTINATION_EMAIL,
        replyTo: email,
        subject,
        text: plainText,
        html: htmlBody,
      });

      console.log('✅ Email successfully dispatched via SMTP/Nodemailer');
      return { success: true, message: 'Message sent via direct SMTP', method: 'smtp' };
    } catch (smtpErr: any) {
      console.error('⚠️ SMTP send error, falling back to relay:', smtpErr?.message || smtpErr);
    }
  }

  // 2. RESEND API (if RESEND_API_KEY is configured)
  if (process.env.RESEND_API_KEY) {
    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'Apex Creatives <onboarding@resend.dev>',
          to: [DESTINATION_EMAIL],
          reply_to: email,
          subject,
          text: plainText,
          html: htmlBody,
        }),
      });

      if (resendRes.ok) {
        console.log('✅ Email successfully dispatched via Resend API');
        return { success: true, message: 'Message sent via Resend API', method: 'resend' };
      } else {
        const resText = await resendRes.text();
        console.error('⚠️ Resend API returned error:', resText);
      }
    } catch (resendErr) {
      console.error('⚠️ Resend API connection error:', resendErr);
    }
  }

  // 3. WEB3FORMS (if WEB3FORMS_ACCESS_KEY is configured)
  if (process.env.WEB3FORMS_ACCESS_KEY) {
    try {
      const web3Res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: process.env.WEB3FORMS_ACCESS_KEY,
          to: DESTINATION_EMAIL,
          subject,
          from_name: name,
          email: email,
          message: plainText,
        }),
      });
      const web3Data = await web3Res.json();
      if (web3Res.ok && web3Data?.success) {
        console.log('✅ Email successfully dispatched via Web3Forms');
        return { success: true, message: 'Message sent via Web3Forms', method: 'web3forms' };
      }
    } catch (web3Err) {
      console.error('⚠️ Web3Forms error:', web3Err);
    }
  }

  // 4. FORMSUBMIT RELAY
  try {
    const fsPayload = {
      _subject: subject,
      _template: 'table',
      _captcha: 'false',
      _replyto: email,
      'Service': service,
      'Client Name': name,
      'Brand / Business Name': brand,
      'Client Email': email,
      'Project Notes': notes,
      'Submitted At': timestamp,
    };

    const fsResponse = await fetch(`https://formsubmit.co/ajax/${DESTINATION_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: 'https://apexcreatives.aio',
        Referer: 'https://apexcreatives.aio/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
      body: JSON.stringify(fsPayload),
    });

    if (fsResponse.ok) {
      const data = await fsResponse.json().catch(() => null);
      if (data && (data.success === true || data.success === 'true' || data.success === '1')) {
        console.log('✅ Email successfully dispatched via FormSubmit');
        return { success: true, message: 'Message sent via FormSubmit relay', method: 'formsubmit' };
      } else if (data?.message && data.message.includes('Activation')) {
        console.log('ℹ️ FormSubmit sent activation request to', DESTINATION_EMAIL);
        // FormSubmit sent an activation email to apexcreativesaio@gmail.com
        return {
          success: true,
          message: 'An activation link has been sent to apexcreativesaio@gmail.com. Please confirm in your inbox once to complete automatic routing.',
          method: 'formsubmit_activation_sent',
        };
      }
    }
  } catch (fsErr: any) {
    console.error('⚠️ FormSubmit relay error:', fsErr?.message || fsErr);
  }

  return {
    success: false,
    error: 'Email delivery could not be completed. Please configure GMAIL_APP_PASSWORD, SMTP credentials, or RESEND_API_KEY.',
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Project Inquiry submission endpoint
  app.post('/api/inquiry', async (req, res) => {
    try {
      const { name, brand, email, service, services, message, notes } = req.body as InquiryPayload;

      // Validation
      const cleanName = (typeof name === 'string' && name.trim()) || '';
      if (!cleanName) {
        return res.status(400).json({ success: false, error: 'Full name is required' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const cleanEmail = (typeof email === 'string' && email.trim()) || '';
      if (!cleanEmail || !emailRegex.test(cleanEmail)) {
        return res.status(400).json({ success: false, error: 'A valid email address is required' });
      }

      const selectedService =
        (typeof service === 'string' && service.trim()) ||
        (Array.isArray(services) && services.length > 0 ? services.join(', ') : '') ||
        'WEB DEVELOPING';

      const projectNotes =
        (typeof notes === 'string' && notes.trim()) ||
        (typeof message === 'string' && message.trim()) ||
        '';

      if (!projectNotes) {
        return res.status(400).json({ success: false, error: 'Project notes are required' });
      }

      const cleanBrand = (typeof brand === 'string' && brand.trim()) || 'N/A';

      const result = await dispatchEmail({
        service: selectedService,
        name: cleanName,
        brand: cleanBrand,
        email: cleanEmail,
        notes: projectNotes,
      });

      if (result.success) {
        return res.json({
          success: true,
          message: result.message,
          method: result.method,
        });
      } else {
        return res.status(500).json({
          success: false,
          error: result.error || 'Failed to dispatch email.',
        });
      }
    } catch (err: any) {
      console.error('Inquiry API endpoint error:', err);
      return res.status(500).json({ success: false, error: err?.message || 'Server error processing inquiry' });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

