import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = nodemailer.createTransport({
     host: "smtp.gmail.com", // Explicitly define the host
      port: 465,             // Use port 465 for SMTPS (secure connection)
      secure: true,  
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Ethio Market" <${process.env.EMAIL_USER}>`,
      to, 
      subject,
      html,
    });
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
  }
};
