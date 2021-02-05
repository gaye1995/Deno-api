import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";
import { xor } from "https://deno.land/x/god_crypto@v1.4.6/src/helper.ts";
import { config } from '../config/config.ts';


//const client = new SmtpClient();
const {
    EMAIL_USER,
    EMAIL_PASSWORD
} = config;

 export const smtpconnect = async (email: string)=>{
    const client = new SmtpClient();
    const text = "Vous venez de vous inscrire sur notre site deno Imie";
    await client.connectTLS({
        hostname: "smtp.gmail.com",
        port: 465,
        username: EMAIL_USER,
        password: EMAIL_PASSWORD,
      });
      
      await client.send({
        from: EMAIL_USER, // Your Email address
        to: email, // Email address of the destination
        subject: "Mail Title",
        content: text,
      });
      
      await client.close();
}