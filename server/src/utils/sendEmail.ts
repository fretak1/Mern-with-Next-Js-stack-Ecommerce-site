import * as Brevo from "@getbrevo/brevo";

// Initialize the API instance
const apiInstance = new Brevo.TransactionalEmailsApi();

// Authenticate
(apiInstance as any).apiKey = process.env.BREVO_API_KEY!;
apiInstance.defaultHeaders = {
  ...apiInstance.defaultHeaders,
  "api-key": process.env.BREVO_API_KEY!,
};

// TypeScript-friendly sendEmail function
export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  try {
    // Create the email object
    const sendSmtpEmail: Brevo.SendSmtpEmail = {
      sender: {
        name: "Ethio Market",
        email: process.env.SMTP_USER!,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    };

    // Send the email
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Email sent successfully!", response);
  } catch (error: any) {
    // Handle errors safely
    console.error("Email sending failed:", error?.response?.body || error);
  }
};
