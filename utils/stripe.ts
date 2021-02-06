import { Context } from 'https://deno.land/x/oak/mod.ts';
import "https://deno.land/x/dotenv/load.ts";
import { config } from '../config/config.ts';



export const subsstripe = async(ctx: Context) => {

    var checkheader : any = new Headers();
    checkheader.append("Authorization", "Basic "+config.STRIPE_SECRET_KEY);
    checkheader.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded : any = new URLSearchParams();
    urlencoded.append("type", "card");
    urlencoded.append("card[number]", "4242424242424242");
    urlencoded.append("card[exp_month]", "10");
    urlencoded.append("card[exp_year]", "2030");
    urlencoded.append("card[cvc]", "123");

    var requestOptions : any = {
    method: 'POST',
    headers: checkheader,
    body: urlencoded,
    redirect: 'follow'
    };

    const methodes = await fetch("https://api.stripe.com/v1/payment_methods", requestOptions)
    const responseMethodes = await methodes.json()

    var checkheader : any = new Headers();
    checkheader.append("Authorization", "Basic "+config.STRIPE_SECRET_KEY);
    checkheader.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded : any = new URLSearchParams();
    urlencoded.append("payment_method", responseMethodes.id);
    urlencoded.append("email", "gayegayemboup@gmail.com");

    var requestOptions : any = {
    method: 'POST',
    headers: checkheader,
    body: urlencoded,
    redirect: 'follow'
    };

    const customers : any = await fetch("https://api.stripe.com/v1/customers", requestOptions)
    const responseCustomer = await customers.json()
  

    var checkheader : any = new Headers();
    checkheader.append("Authorization", "Basic "+config.STRIPE_SECRET_KEY);
    checkheader.append("Content-Type", "application/x-www-form-urlencoded");


    var urlencoded : any = new URLSearchParams();
    urlencoded.append("items[0][price]", config.TOKENPRODUCT);
    urlencoded.append("customer", responseCustomer.id);
    urlencoded.append("default_payment_method", responseMethodes.id);

    var requestOptions : any = {
    method: 'POST',
    headers: checkheader,
    body: urlencoded,
    redirect: 'follow'
    };

    const subcription = await fetch("https://api.stripe.com/v1/subscriptions", requestOptions)
    const subsstripe = await subcription.json()

    ctx.response.status = 200;
    ctx.response.body = { "error": true, "message": subsstripe  }

}

  



