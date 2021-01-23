import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";
import { config } from '../config/config.ts';


const client = new SmtpClient();
const {
    EMAIL_USER,
    EMAIL_PASSWORD
} = config
 await client.connect({
    hostname: "smtp.163.com",
    port: 25,
    username: EMAIL_USER,
    password: EMAIL_PASSWORD,
    });
export const sendMail = (email: string) => {
 client.send({
  from: EMAIL_USER,
  to: email,
  subject: "Inscription réussi",
  content: "Mail Content",
  html: "<a href='https://github.com'>Github</a>",
});
}
await client.close();