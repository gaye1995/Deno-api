
import { UserDB } from './../db/UserDB.ts';
import * as jwt from '../middlewares/jwt-middleware.ts';
import { UserModels } from '../Models/UserModels.ts';
import { roleTypes } from '../types/rolesTypes.ts';
import { HandlerFunc } from 'https://deno.land/x/abc@v1.2.4/types.ts';
import { Context } from 'https://deno.land/x/abc@v1.2.4/context.ts';
import PasswordException from '../exception/PasswordException.ts';
import EmailException from '../exception/EmailException.ts';
import { Get } from "https://deno.land/x/abc@v1.2.4/_http_method.ts";
import { reset } from "https://deno.land/std@0.77.0/fmt/colors.ts";
import {getToken} from '../middlewares/jwt-middleware.ts'
import { getJwtPayload } from "../middlewares/jwt-middleware.ts";
import { Bson } from "https://deno.land/x/bson/mod.ts";
import {smtpconnect} from '../helpers/mails.ts'
import { subsstripe } from '../utils/stripe.ts';
export class CartControllers {

static usercart: HandlerFunc = async(c: Context) => {
    let _userdb: UserDB = new UserDB();
    let userdb = _userdb.userdb;
    const authorization: any = c.request.headers.get("authorization");
    if(authorization){
        const token = await getToken(authorization);
        const data = await getJwtPayload(token);
        let email  = data.email;
        const datacart : any = await c.body;
        const cart : any = await userdb.findOne({cart: datacart.cart})
        if(!token)
        {
           return c.json({ error: true, message: "Votre token n'est pas correct" })
        }else if(cart)
        {
            return c.json({ error: true, message: "La carte existe déjà" });
        }



    }
}
}