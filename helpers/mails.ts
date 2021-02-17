import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";
import { xor } from "https://deno.land/x/god_crypto@v1.4.6/src/helper.ts";
import { config } from '../config/config.ts';


//const client = new SmtpClient();
const {
    EMAIL_USER,
    EMAIL_PASSWORD
} = config;
const client = new SmtpClient();

 export const smtpconnect = async ()=>{
    await client.connectTLS({
        hostname: "smtp.gmail.com",
        port: 465,
        username: EMAIL_USER,
        password: EMAIL_PASSWORD,
      });
}
export const mailRegister = async (email: string)=>{
  await smtpconnect();
  const text = "Vous venez de vous inscrire sur notre site deno Imie";
      await client.send({
        from: EMAIL_USER, // Your Email address
        to: email, // Email address of the destination
        subject: "Mail Title",
        content: text,
      });
      
      await client.close();
}
export const mailajoutCart = async (email: string)=>{
  await smtpconnect();
  const text = "Vous venez d'inserer un carte de paiement dans votre espace personnel";
      await client.send({
        from: EMAIL_USER, // Your Email address
        to: email, // Email address of the destination
        subject: "Mail Title",
        content: text,
      });
      
      await client.close();
}
export const mailAbonnementStripe = async (email: string)=>{
  await smtpconnect();
  const text = "Vous venez de vous abonnez sur notre site";
      await client.send({
        from: EMAIL_USER, // Your Email address
        to: email, // Email address of the destination
        subject: "Mail Title",
        content: text,
      });
      
      await client.close();
}