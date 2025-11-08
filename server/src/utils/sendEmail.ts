import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const response = await resend.emails.send({
      from: `"Ethio Market" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully:", response);
    return response; // optional: return the response if needed
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error; // optional: re-throw to handle it elsewhere
  }
};
