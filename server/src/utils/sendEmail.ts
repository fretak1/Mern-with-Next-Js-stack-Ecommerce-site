import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
// You should ensure your environment variables are loaded,
// for example, by using 'dotenv/config' at the entry point of your app.

// 1. Initialize MailerSend client once
const mailerSend = new MailerSend({
  // MailerSend uses the API key for authentication
  apiKey: process.env.MAILERSEND_API_KEY as string,
});

/**
 * Sends an email using the MailerSend SDK.
 * @param to The recipient's email address.
 * @param subject The email subject line.
 * @param html The HTML body of the email.
 */
export const sendEmail = async (to: string, subject: string, html: string) => {
  // Use the verified sender email address from environment variables
  const senderEmail = process.env.MAILERSEND_SENDER_EMAIL as string;

  if (!senderEmail) {
    console.error("MailerSend sender email is not configured!");
    return;
  }

  try {
    // 2. Define the sender and recipient objects
    const sentFrom = new Sender(senderEmail, "Ethio Market");
    const recipients = [new Recipient(to)];

    // 3. Create the email parameters object
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(subject)
      .setHtml(html);

    // Optionally set plain text for better deliverability
    // .setText(convertHtmlToPlainText(html));

    // 4. Send the email
    await mailerSend.email.send(emailParams);

    console.log(`Email successfully sent to ${to} via MailerSend.`);
  } catch (error) {
    // MailerSend errors often include a response object with more details
    console.error(`Failed to send email to ${to}:`, error);
    // You might inspect error.response.body for specific API error messages
  }
};
