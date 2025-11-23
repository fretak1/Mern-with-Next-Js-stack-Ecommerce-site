import * as Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setDefaultAuthentication(
  new Brevo.ApiKeyAuth("header", "api-key", process.env.BREVO_API_KEY!)
);

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = {
      name: "Ethio Market",
      email: process.env.SMTP_USER!,
    };
    sendSmtpEmail.to = [{ email: to }];

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent!", response);
  } catch (error: any) {
    console.error("Failed:", error?.response?.body || error);
  }
};
