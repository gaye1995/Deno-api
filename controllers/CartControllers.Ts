
import { UserDB } from './../db/UserDB.ts';
import * as jwt from '../middlewares/jwt-middleware.ts';
import { UserModels } from '../Models/UserModels.ts';
import { roleTypes } from '../types/rolesTypes.ts';
import { HandlerFunc } from 'https://deno.land/x/abc@v1.2.4/types.ts';
import { Context } from 'https://deno.land/x/abc@v1.2.4/context.ts';
import PasswordException from '../exception/PasswordException.ts';
import EmailException from '../exception/EmailException.ts';
import { Get } from "https://deno.land/x/abc@v1.2.4/_http_method.ts";
import { cardModels } from "../Models/CardModels.ts";
import {getToken} from '../middlewares/jwt-middleware.ts'
import { getJwtPayload } from "../middlewares/jwt-middleware.ts";
import { Bson } from "https://deno.land/x/bson/mod.ts";
import {verifyCart} from '../middlewares/cart-middlewares.ts'
import { subsstripe } from '../utils/stripe.ts';
import { smtpconnect } from "../helpers/mails.ts";
export class CartControllers {

static usercart: HandlerFunc = async(c: Context) => {
    let _userdb: UserDB = new UserDB();
    let userdb = _userdb.userdb;
    const authorization: any = c.request.headers.get("authorization");
    if(authorization){
        const token = await getToken(authorization);
        const data = await getJwtPayload(token);
        const users : any = await userdb.findOne({email: data.email});
        const datacart : any = await c.body;
        const cart : any = await userdb.findOne({cart: datacart.cart})
        if(!token)
        {
            c.response.status = 401;
           return c.json({ error: true, message: "Votre token n'est pas correct" })
        }else if(verifyCart(cart)){
            c.response.status = 402;
            return c.json({ error: true, message: "Informations bancaire incorrectes" });
        }else if(cart){
            c.response.status = 409;
            return c.json({ error: true, message: "La carte existe déjà" });
        }else if(users.subscription == 0){
            c.response.status = 403;
            return c.json({ error: true, message: "Vos droits d'accès ne permettent pas d'accéder à la ressource" });
        }else{
            const carthash = await PasswordException.hashPassword(datacart.cartNumber);
            const carte : any = new cardModels(
                carthash,
                datacart.month.getMonth(),
                datacart.year.getFullYear(),
                datacart.default,
                users._id);
            
        await carte.insert();
        await smtpconnect(users.email);
        }
    
    
    }else{
    
    }
}
}