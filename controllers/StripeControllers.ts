import "https://deno.land/x/dotenv/load.ts";
import { config } from '../config/config.ts';
import { Context } from 'https://deno.land/x/abc@v1.2.4/context.ts';
import {mailAbonnementStripe} from '../helpers/mails.ts'
import { HandlerFunc } from 'https://deno.land/x/abc@v1.2.4/types.ts';
import { UserDB } from "../db/UserDB.ts";
import { getJwtPayload, getToken } from "../middlewares/jwt-middleware.ts";

export class StripeControllers {

    static subsstripe : HandlerFunc = async (c: Context) => {
        const {
            STRIPE_SECRET_KEY,
            STRIP_ID_PRODUIT
        } = config;
   

            var checkheader : any = new Headers();
            checkheader.append("Authorization", "Bearer "+ STRIPE_SECRET_KEY);
            checkheader.append("Content-Type", "application/x-www-form-urlencoded");

            var link : any = new URLSearchParams();
            link.append("type", "card");
            link.append("card[number]", "4242424242424242");
            link.append("card[exp_month]", "10");
            link.append("card[exp_year]", "2030");
            link.append("card[cvc]", "123");

            var requestOptions : any = {
            method: 'POST',
            headers: checkheader,
            body: link,
            redirect: 'follow'
            };

            const methodes = await fetch("https://api.stripe.com/v1/payment_methods", requestOptions)
            const responseMethodes = await methodes.json()
            //console.log(responseMethodes);


            var checkheader : any = new Headers();
            checkheader.append("Authorization", "Bearer "+ STRIPE_SECRET_KEY);
            checkheader.append("Content-Type", "application/x-www-form-urlencoded");
            var link : any = new URLSearchParams();
            link.append("payment_method", responseMethodes.id);
            link.append("email", "gayegayemboup@gmail.com");

            var requestOptions : any = {
            method: 'POST',
            headers: checkheader,
            body: link,
            redirect: 'follow'
            };

            const client : any = await fetch("https://api.stripe.com/v1/customers", requestOptions)
            const respclient = await client.json()
            //console.log(respclient);

            var checkheader : any = new Headers();
            checkheader.append("Authorization", "Bearer "+ STRIPE_SECRET_KEY);
            checkheader.append("Content-Type", "application/x-www-form-urlencoded");


            var link : any = new URLSearchParams();
            link.append("items[0][price]", STRIP_ID_PRODUIT);
            link.append("client", respclient.id);
            link.append("default_payment_method", responseMethodes.id);
            //console.log(link);

            var requestOptions : any = {
            method: 'POST',
            headers: STRIPE_SECRET_KEY,
            client: respclient.id,
            price: STRIP_ID_PRODUIT,
            body: link,
            redirect: ''
            };
           
        console.log(requestOptions);
            const subscription = await fetch("https://api.stripe.com/v1/subscriptions", requestOptions)
            console.log(subscription);
            return c.json({error: false, message: "Votre période d'essai viens d'être activé - 5min"  ,subscription},200);
        

    }

}



