import * as Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY!
);

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail({
      sender: {
        name: "Ethio Market",
        email: process.env.SMTP_USER!,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent!", response.body);
  } catch (error: any) {
    console.error("FAILED:", error?.response?.body || error);
  }
};
