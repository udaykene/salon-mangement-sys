import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send OTP verification email
 */
export const sendOtpEmail = async (email, otp, purpose = "signup") => {
  const subjectMap = {
    signup: "Verify Your Email — Glamour Studio",
    "email-change": "Confirm Email Change — Glamour Studio",
    "password-reset": "Reset Your Password — Glamour Studio",
    "phone-change": "Confirm Phone Number Change — Glamour Studio",
  };

  const messageMap = {
    signup: "Complete your registration by entering the OTP below:",
    "email-change":
      "You requested to change your email. Verify with the OTP below:",
    "password-reset": "Use the OTP below to reset your password:",
    "phone-change":
      "You requested to change your mobile number. Verify with the OTP below:",
  };

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 480px; margin: 0 auto; background: #0d0d0f; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08);">
      <div style="background: linear-gradient(135deg, #f43f5e, #ec4899); padding: 32px 24px; text-align: center;">
        <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 700;">✦ Glamour Studio</h1>
      </div>
      <div style="padding: 32px 24px; color: rgba(255,255,255,0.87);">
        <p style="margin: 0 0 16px; font-size: 15px; color: rgba(255,255,255,0.6);">
          ${messageMap[purpose] || messageMap.signup}
        </p>
        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #f43f5e;">${otp}</span>
        </div>
        <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.35);">
          This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.
        </p>
      </div>
      <div style="padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
        <p style="margin: 0; font-size: 11px; color: rgba(255,255,255,0.2);">
          © ${new Date().getFullYear()} Glamour Studio. All rights reserved.
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: subjectMap[purpose] || subjectMap.signup,
    html,
  });
};

/**
 * Send welcome email after successful signup
 */
export const sendWelcomeEmail = async (email, name) => {
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 480px; margin: 0 auto; background: #0d0d0f; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08);">
      <div style="background: linear-gradient(135deg, #f43f5e, #ec4899); padding: 32px 24px; text-align: center;">
        <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 700;">✦ Glamour Studio</h1>
      </div>
      <div style="padding: 32px 24px; color: rgba(255,255,255,0.87);">
        <h2 style="margin: 0 0 8px; font-size: 20px; color: white;">Welcome, ${name}! 🎉</h2>
        <p style="margin: 0 0 20px; font-size: 15px; color: rgba(255,255,255,0.6);">
          Your account has been created successfully. You're now part of the Glamour Studio family!
        </p>
        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px;">
          <p style="margin: 0 0 12px; font-size: 14px; color: rgba(255,255,255,0.5);">Here's what you can do now:</p>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.8;">
            <li>Browse our premium services</li>
            <li>Book appointments online</li>
            <li>Manage your profile & preferences</li>
          </ul>
        </div>
        <div style="text-align: center; margin-top: 24px;">
          <a href="${(process.env.CUSTOMER_APP_URL || process.env.CLIENT_URL || "http://localhost").replace(/\/$/, "")}/services" 
             style="display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #f43f5e, #ec4899); color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px;">
            Explore Services
          </a>
        </div>
      </div>
      <div style="padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
        <p style="margin: 0; font-size: 11px; color: rgba(255,255,255,0.2);">
          © ${new Date().getFullYear()} Glamour Studio. All rights reserved.
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Welcome to Glamour Studio! ✦",
    html,
  });
};
