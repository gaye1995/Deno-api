import "https://deno.land/x/dotenv/load.ts";
import { config } from '../config/config.ts';
import { Context } from 'https://deno.land/x/abc@v1.2.4/context.ts';
import {mailAbonnementStripe,mailajoutCart} from '../helpers/mails.ts'
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
        if(!authorization || !token){
            c.json({ error: true, "message": "Votre token n'est pas correct" },401);
        }
            var checkheader : any = new Headers();
            checkheader.append("Authorization", "Bearer "+ STRIPE_SECRET_KEY);
            checkheader.append("Content-Type", "application/x-www-form-urlencoded");
            const data : any = await c.body;
            if(data.cartNumber == "" || data.month == ""|| data.year == ""|| data.default == ""){
                return c.json({ error: true, message: "Une ou plusieurs données sont manquantes" }),402;
            }
            else if(data.cartNumber.length > 16 || data.default.length>3 || isNaN(data.month) || data.month.length>2  || isNaN(data.year) || data.month>12  || data.year.length>4 || data.year>2020 || isNaN(data.default) || data.default.length>3){
                return c.json({error: true, message: "Informations bancaire incorrectes" }),402;
            // }else if(data.cartNumber){
            //     c.json({ error: true, message: "La carte existe déjà" },409);
             }
             else if(user.subscription == 0){
                c.json({ error: true, message: "Vos droits d'accès ne permettent pas d'accéder à la ressource" },403);
            }
            else{ 
            var link : any = new URLSearchParams();
            link.append("type", "card");
            link.append("card[number]", data.cartNumber);
            link.append("card[exp_month]", data.month);
            link.append("card[exp_year]", data.year);
            link.append("card[cvc]", data.default);

            mailajoutCart(user.email)
            return c.json({error: false, message: "Vos données ont été mises à jour"  },200);
        }
    }catch{
        return c.json({error: false, message: "Votre token n'est pas correct" },401);

    }
}

    static subsstripe : HandlerFunc = async (c: Context) => {
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
        if(!authorization || !token){
            c.json({ error: true, "message": "Votre token n'est pas correct" },401);
        }
            var checkheader : any = new Headers();
            checkheader.append("Authorization", "Bearer "+ STRIPE_SECRET_KEY);
            checkheader.append("Content-Type", "application/x-www-form-urlencoded");
            const data : any = await c.body;
            if(data.cartNumber== "" || data.cvc ==""){
                c.json({ error: true, message: "Une ou plusieurs données obligatoire sont manquantes" });
            }
            var link : any = new URLSearchParams();
            link.append("type", "card");
            link.append("card[number]", data.cartNumber);
            link.append("card[exp_month]", data.month);
            link.append("card[exp_year]", data.year);
            link.append("card[cvc]", data.cvc);

            var requestOptions : any = {
            method: 'POST',
            headers: checkheader,
            body: link,
            redirect: 'follow'
        
            };
            const methodes = await fetch("https://api.stripe.com/v1/payment_methods", requestOptions)
            const responseMethodes = await methodes.json()
            if(!methodes){
               c.json({ error: true, message: "Echec du payement de l'offre" },402);
            }

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

            var checkheader : any = new Headers();
            checkheader.append("Authorization", "Bearer "+ STRIPE_SECRET_KEY);
            checkheader.append("Content-Type", "application/x-www-form-urlencoded");


            var link : any = new URLSearchParams();
            link.append("items[0][price]", STRIP_ID_PRODUIT);
            link.append("client", respclient.id);
            link.append("default_payment_method", responseMethodes.id);

            var requestOptions : any = {
            method: 'POST',
            headers: STRIPE_SECRET_KEY,
            client: respclient.id,
            price: STRIP_ID_PRODUIT,
            body: link.toString(),
            redirect: ''
            };
           
            const subscription = await fetch("https://api.stripe.com/v1/subscriptions", requestOptions)
            await userdb.updateOne(
                { email: user.email },
                {$set: {subscription: 1}}); 
            mailAbonnementStripe(user.email);
            return c.json({ error: false, message: "Votre période d'essai viens d'être activé - 5min" ,subscription},200);

    }catch{
     c.json({ error: true, "message": "Votre token n'est pas correct" },401);
        
    }

}
}


