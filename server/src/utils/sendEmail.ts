import * as Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();

// Correct authentication (ONLY 2 arguments)
apiInstance.setDefaultAuthentication(
  new Brevo.ApiKeyAuth("api-key", process.env.BREVO_API_KEY!)
);

apiInstance.getTransacEmailTemplates()
  .then(() => console.log("API Key is working!"))
  .catch(err => console.error("API Key is NOT working:", err?.response?.body || err));


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
