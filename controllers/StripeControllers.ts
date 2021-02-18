import "https://deno.land/x/dotenv/load.ts";
import { config } from '../config/config.ts';
import { Context } from 'https://deno.land/x/abc@v1.2.4/context.ts';
import {mailAbonnementStripe} from '../helpers/mails.ts'
import { HandlerFunc } from 'https://deno.land/x/abc@v1.2.4/types.ts';
import { UserDB } from "../db/UserDB.ts";
import { getJwtPayload, getToken } from "../middlewares/jwt-middleware.ts";

export class StripeControllers {
    static cart : HandlerFunc = async (c: Context) => {
        const {
            STRIPE_SECRET_KEY,
            STRIP_ID_PRODUIT
        } = config;
        let _userdb: UserDB = new UserDB();
        let userdb = _userdb.userdb;
        try {
        const authorization: any = c.request.headers.get("authorization");
        const token = await getToken(authorization);
        const dataparent = await getJwtPayload(token);
        const user: any = await userdb.findOne({ email: dataparent.email })
        console.log(authorization);
        if(!authorization || !token){
            c.json({ error: true, "message": "Votre token n'est pas correct" },401);
        }
            var checkheader : any = new Headers();
            checkheader.append("Authorization", "Bearer "+ STRIPE_SECRET_KEY);
            checkheader.append("Content-Type", "application/x-www-form-urlencoded");
            const data : any = await c.body;
            if(data.cartNumber.length > 16 || data.default.length>3 || isNaN(data.month) || data.month.length>2 || isNaN(data.year) || data.year.length>4 || isNaN(data.default) || data.default.length>3){
                return c.json({error: true, message: "Informations bancaire incorrectes" });
            }else if(data.cartNumber){
                c.json({ error: true, message: "La carte existe déjà" });
            }else{ 
            var link : any = new URLSearchParams();
            link.append("type", "card");
            link.append("card[number]", data.cartNumber);
            link.append("card[exp_month]", data.month);
            link.append("card[exp_year]", data.year);
            link.append("card[cvc]", data.default);

            var requestOptions : any = {
            method: 'POST',
            headers: STRIPE_SECRET_KEY,
            body: link,
            redirect: 'follow'
            };  
            console.log(checkheader);
            console.log(link);
            const client : any = await fetch("https://api.stripe.com/v1/customers", requestOptions)
            //const respclient = await client.json()

            return c.json({error: false, message: "Votre période d'essai viens "  },200);
        }
    }catch{

    }
}

    static subsstripe : HandlerFunc = async (c: Context) => {
        const {
            STRIPE_SECRET_KEY,
            STRIP_ID_PRODUIT
        } = config;
   

            var checkheader : any = new Headers();
            checkheader.append("Authorization", "Bearer "+ STRIPE_SECRET_KEY);
            checkheader.append("Content-Type", "application/x-www-form-urlencoded");
            const data : any = await c.body;
            console.log(data);
            var link : any = new URLSearchParams();
            link.append("type", "card");
            link.append("card[number]", data.cartNumber);
            link.append("card[exp_month]", data.month);
            link.append("card[exp_year]", data.year);
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



