import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      port: 587,
      secure: false,
      requireTLS:true,
      logger:true,
      debug:true
    });

    await transporter.sendMail({
      from: `"Ethio Market" <${process.env.EMAIL_USER}>`,
      to, // single email at a time
      subject,
      html,
    });
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
  }
};

