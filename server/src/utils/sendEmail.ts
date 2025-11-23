import * as Brevo from "@getbrevo/brevo";

// Initialize the API client
const apiInstance = new Brevo.TransactionalEmailsApi();

// Set API Key
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY as string
);

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;

    sendSmtpEmail.sender = {
      name: "Ethio Market",
      email: process.env.SMTP_USER as string,
    };

    sendSmtpEmail.to = [{ email: to }];

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`Email sent successfully to ${to}:`, response);
  } catch (error: any) {
    console.error(`Failed to send email to ${to}:`, error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};
