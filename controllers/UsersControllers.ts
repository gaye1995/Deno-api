
import { UserDB } from './../db/UserDB.ts';
import * as jwt from '../helpers/jwt.ts';
import { UserModels } from '../Models/UserModels.ts';
import { roleTypes } from '../types/rolesTypes.ts';
import { HandlerFunc } from 'https://deno.land/x/abc@v1.2.4/types.ts';
import { Context } from 'https://deno.land/x/abc@v1.2.4/context.ts';
import PasswordException from '../exception/PasswordException.ts';
import EmailException from '../exception/EmailException.ts';
import { Get } from "https://deno.land/x/abc@v1.2.4/_http_method.ts";
import { reset } from "https://deno.land/std@0.77.0/fmt/colors.ts";
import {SubscriptionModels} from '../Models/SubscriptionModels.ts';
import {getToken} from '../middlewares/jwt-middleware.ts'
import { getJwtPayload } from "../helpers/jwt.ts";


export class UsersControllers {


    static register: HandlerFunc = async(c: Context) => {

        let _userdb: UserDB = new UserDB();
        let userdb = _userdb.userdb;

        const data : any = await c.body;
                try {
            const user: any = await userdb.findOne({ email: data.email })
            if(user){
                c.response.status = 409;
                return c.json({ error: false, message: 'Email/password incorrect' });
            }else{
                const pass = await PasswordException.hashPassword(data.password);
                const User = new UserModels(
                    data.email,
                    pass,
                    data.lastname,
                    data.firstname,
                    data.dateNaiss,
                    data.sexe,
                    data.phoneNumber,
                    data.subscription,
                    );
                await User.insert();
                c.response.status = 200;
                return c.json({ error: false, message: "l'utilisateur a bien été créé avec succés", User});
            }
            } catch (err) {
                c.response.status = 401;
                return c.json({ error: true, message: err.message });
            }
    }

    static login: HandlerFunc = async(c: Context) => {

        let _userdb: UserDB = new UserDB();
        let userdb = _userdb.userdb;

        let data : any = await c.body;
        try {
            const user: any = await userdb.findOne({ email: data.email })
            if(data.email == undefined || data.password == undefined)
            {
                return c.json({ error: false, message: 'Une ou plusieurs données obligatoire sont manquantes' });
            }
            else if(!user){
                c.response.status = 400;
                return c.json({ error: false, message: 'Email/password incorrect'});
            }
             
            else if(!PasswordException.comparePassword(data.password, user.password ))
            {
                c.response.status = 400;
                return c.json({ error: false, message: 'Email/password incorrect' });
            }else {
           const token = {
            'access_token': await jwt.getAuthToken(user),
            'refresh_token': await jwt.getRefreshToken(user),
            };
            c.response.status = 200;
            return c.json({ error: false, message: "l'utilisateur a été authentifiée succés", user, token });
        }
        } catch (err) {
            c.response.status = 401;
            return { error: true, message: err.message };
        }
    }
    static modifuser: HandlerFunc = async(c: Context) => {

      
    }
    static deleteuser: HandlerFunc = async(c: Context) => {

      
    } 
    static subscription: HandlerFunc = async(c: Context) => {
        let _userdb: UserDB = new UserDB();
        let userdb = _userdb.userdb;
        const authorization: any = c.request.headers.get("authorization");
        if(authorization){
            const token = await getToken(authorization);
            if(!token){
                return c.json({Error: true, message: "Votre token n'est pas correct"});
            }
            const data = await getJwtPayload(token);
            let email  = data.email; 
            const user = await userdb.findOne({email});
            const { modifiedCount } = await userdb.updateOne(
                { email: data.email },
                { $set: user.subscription = 1 },
                { $set: user.role = "Parent" } );
            if(modifiedCount){
                c.json({Error: false, message: "Votre abonnement a bien été mise à jour"});
            }

             
            return c.json(user);
        }
       
      
    }

    static userchild: HandlerFunc = async(c: Context) => {

        let _userdb: UserDB = new UserDB();
        let userdb = _userdb.userdb;

        const data : any = await c.body;
                try {
            const user: any = await userdb.findOne({ email: data.email })
            if(user){
                c.response.status = 409;
                return c.json({ error: false, message: 'Email/password incorrect' });
            }else{
                const pass = await PasswordException.hashPassword(data.password);
                const User = new UserModels(
                    data.email,
                    pass,
                    data.lastname,
                    data.firstname,
                    data.dateNaiss,
                    data.sexe,
                    data.phoneNumber,
                    data.subscription,
                    );
                await User.insert();
                c.response.status = 200;
                return c.json({ error: false, message: "l'utilisateur a bien été créé avec succés", User});
            }
            } catch (err) {
                c.response.status = 401;
                return c.json({ error: true, message: err.message });
            }
    }
}

