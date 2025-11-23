import * as Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();

// THIS is the correct authentication method for SDK v3
(apiInstance as any).apiKey = process.env.BREVO_API_KEY!;
apiInstance.defaultHeaders = {
  ...apiInstance.defaultHeaders,
  "api-key": process.env.BREVO_API_KEY!,
};

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const email = new Brevo.SendSmtpEmail({
      sender: {
        name: "Ethio Market",
        email: process.env.SMTP_USER!,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    const response = await apiInstance.sendTransacEmail(email);
    console.log("Email sent!", response.body);
  } catch (error: any) {
    console.error("FAILED:", error?.response?.body || error);
  }
};
