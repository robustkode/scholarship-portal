import { Resend } from "resend";
import { config } from "dotenv";
config();

const resend = new Resend(process.env.EMAIL_SERVER_API);
export async function sendEmail(email, subject, body) {
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: "green.dev010@gmail.com",
    subject,
    react: <>{body}</>,
  });

  if (error) {
    throw error;
  }
}
