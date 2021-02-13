
import { UserDB } from './../db/UserDB.ts';
import * as jwt from '../middlewares/jwt-middleware.ts';
import { cardModels } from '../Models/CardModels.ts';
import { roleTypes } from '../types/rolesTypes.ts';
import { HandlerFunc } from 'https://deno.land/x/abc@v1.2.4/types.ts';
import { Context } from 'https://deno.land/x/abc@v1.2.4/context.ts';
import PasswordException from '../exception/PasswordException.ts';
import EmailException from '../exception/EmailException.ts';
import { Get } from "https://deno.land/x/abc@v1.2.4/_http_method.ts";
import {getToken} from '../middlewares/jwt-middleware.ts'
import { getJwtPayload } from "../middlewares/jwt-middleware.ts";
import { Bson } from "https://deno.land/x/bson/mod.ts";
import {verifyCart} from '../middlewares/cart-middlewares.ts'
import { mailajoutCart } from "../helpers/mails.ts";
export class CartControllers {

static usercart: HandlerFunc = async(c: Context) => {
    let _userdb: UserDB = new UserDB();
    let userdb = _userdb.userdb;
    let cartdb = _userdb.cartdb;
    console.log(cartdb);
    console.log(userdb);

    const authorization: any = c.request.headers.get("authorization");
    if(authorization){
        const token = await getToken(authorization);
        const data = await getJwtPayload(token);
        const users : any = await userdb.findOne({email: data.email});
        const datacart : any = await c.body;
        const carthash = await PasswordException.hashPassword(datacart.cartNumber);
        const cart = new cardModels( 
            carthash,
            parseInt(datacart.month) ,
            parseInt(datacart.year),
            datacart.Default
        )
        if(!token)
        {
            c.response.status = 401;
           return c.json({ error: true, message: "Votre token n'est pas correct" })
        }/*else if(!cart){
            c.response.status = 402;
            return c.json({ statut : 402,error: true, message: "Informations bancaire incorrectes" });
        }*/else if(users.cart === cart.cartNumber){
            return c.json({status:409, error: true, message: "La carte existe déjà" });
        }else if(users.subscription == 0){
            return c.json({status: 403, error: true, message: "Vos droits d'accès ne permettent pas d'accéder à la ressource" });
        }else{
            await   userdb.updateOne ( 
                {  email  :  users.email  }, 
                { $push:  {  cart :  cart  }  }); 
        await mailajoutCart(users.email);
        console.log(users.cart);
        return c.json({ status:409 ,error: false, message: "Vos données ont été mises à jour" });
        }
    
    }else{
    
    }
}
}