import { Resend } from "resend";
import { config } from "dotenv";
config();

const resend = new Resend(process.env.EMAIL_SERVER_API);

export async function sendEmail(email, subject, body) {
  console.log(process.env.EMAIL_SERVER_API);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    react: <>{body}</>,
  });

  if (error) {
    console.log("erorr is here");
    throw error;
  }
}
