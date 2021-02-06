
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

export class UsersControllers {

    static register: HandlerFunc = async(c: Context) => {

        let _userdb: UserDB = new UserDB();
        let userdb = _userdb.userdb;
            try {
            const data : any = await c.body;
            const user: any = await userdb.findOne({ email: data.email })
            console.log(data.email);
            if(data.firstname=="" || data.lastname=="" || data.email=="" || data.password=="" || data.dateNaissance==""){
                c.response.status = 400;
                return c.json({error: true, message: "Une ou plusieurs données obligatoire sont manquantes" });
            }else if(!PasswordException.isValidPassword(data.password))
            {
                c.response.status = 409;
                return c.json({ error: true, message: "Une ou plusieurs données obligatoire sont manquantes" });
            }
            else if(user)
            {
                c.response.status = 409;
                return c.json({ error: true, message: "Un compte utilisant cette adresse mail est déjà enregistré" });
            }
            else{
                console.log(data.firstname);
                const pass = await PasswordException.hashPassword(data.password);
                const User = new UserModels(
                    'Tuteur',
                    data.firstname,
                    data.lastname,
                    data.email,
                    data.sexe,
                    pass,
                    data.dateNaissance,
                    );
                await User.insert();
                await smtpconnect(User.email);
                c.response.status = 201;
                return c.json({ error: false, message: "L'utilisateur a bien été créé avec succès",User});
            }
        }catch (err) {
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
                if(data.email == '' || data.password == ''){
                    c.response.status = 400;
                    return c.json({ error: true, message: "Email/password manquants" });
                }
                else if(!user || !PasswordException.comparePassword(data.password, user.password)){
                    c.response.status = 400;
                    return c.json({ error: true, message: "Email/password incorrect" });
                }
                //test nombre de tentatives
            /*  else if( )
                {
                    c.response.status = 400;
                    return c.json({ error: false, message: 'Email/password incorrect' });
                }*/
                else {
                    await userdb.updateOne(
                    { email: user.email },
                    {$set: {access_token: await jwt.getAuthToken(user)}});
                    await userdb.updateOne(
                        { email: user.email },
                        {$set: {refresh_token: await jwt.getRefreshToken(user)}});
                    c.response.status = 200;
                    return c.json({ error: false, message: "L'utilisateur a été authentifié succès", user });
                }
            }catch (err){
                c.response.status = 401;
                return { error: true, message: err.message };
            }
    }
    static modifuser: HandlerFunc = async(c: Context) => {

      
    }
  /*
   static subscription: HandlerFunc = async(c: Context) => {
        let _userdb: UserDB = new UserDB();
        let userdb = _userdb.userdb;
        const authorization: any = c.request.headers.get("authorization");
        if(authorization){
            const token = await getToken(authorization);
            const data = await getJwtPayload(token);
            let email  = data.email;
            if(!token){
                return c.json({ error: true, message: "Votre token n'est pas correct" });
            }
            const dataCard:any = await c.body;
            
             const userclient = stripe.customers.create({
                email: data.email
            });
          if(userclient){
               stripe.charge.create({
                amount: 1000 ,// en centimes, 
               devise: 'usd', 
               source: 'STRIPE_TOKEN_FROM_CLIENT', 
               description: 'Any description about the payment', 
               metadata: { 
                   idcard: dataCard.idcard,
                   cvc: dataCard.cvc  // any meta-data you voulez stocker 
               } 
           })
        }
            const user = await userdb.findOne({email});

            //console.log(user.subscription);
           const { modifiedCount } = await userdb.updateOne(
                { email: data.email },
                { $set: user.subscription = 1 },
                { $set: user.role = "Parent" } );
            if(modifiedCount){
                c.json({Error: false, message: "Votre abonnement a bien été mise à jour"});
            }
            return c.json(user);
        }    
      
    }*/

    static userchild: HandlerFunc = async(c: Context) => {
        let _userdb: UserDB = new UserDB();
        let userdb = _userdb.userdb;
        try {
        const authorization: any = c.request.headers.get("authorization");
            const token = await getToken(authorization);
            const dataparent = await getJwtPayload(token);
            const userParent: any = await userdb.findOne({ email: dataparent.email })
            const data : any = await c.body;
            const user: any = await userdb.findOne({ email: data.email })
            if(data.firstname=="" || data.lastname=="" || data.email=="" || data.password=="" || data.dateNaiss=="" || data.sexe==""){
                c.response.status = 400;
                return c.json({ error: true, message: "Une ou plusieurs données obligatoire sont manquantes" })
            }
            else if(!token){
                return c.json({Error: true, message: "Votre token n'est pas correct"});
            }else if(!PasswordException.isValidPassword(data.password) || EmailException.checkEmail(data.email))
            {
                c.response.status = 409;
                return c.json({ error: true, message: "Une ou plusieurs données sont erronées" });
            }else if(user){
                c.response.status = 409;
                return c.json({ error: true, message: "Un compte utilisant cette adresse mail est déjà enregistré" });
            //}else if(user.count({idparent: userdb._id}) <=3){
               // c.json({ error: true, message: "Vous avez dépassé le cota de trois enfants" });
            }
            else{
                   const pass = await PasswordException.hashPassword(data.password);
                   const User = new UserModels(
                    'Enfant',
                    data.firstname,
                    data.lastname,
                    data.email,
                    data.sexe,
                    pass,
                    data.dateNaissance,
                    userParent._id
                    );
                    const count = await userdb.count({ idparent: userParent._id});
                    const nbenfant = (count > 3 ) ? c.json({ error: true, message: "Vous avez dépassé le cota de trois enfants" }) : 
                    await User.insert();
                    console.log(userParent._id);
                    console.log(User.idparent);

                c.response.status = 200;
                return c.json({ error: false, message: "Votre enfant a bien été créé avec succès",User});
            }    
        }catch (err){
            c.response.status = 401;
            return c.json({ error: true, message: err.message });
        }
}

static deleteuser: HandlerFunc = async(c: Context) => {
    let _userdb: UserDB = new UserDB();
    let userdb = _userdb.userdb;
    const authorization: any = c.request.headers.get("authorization");
    if(authorization){
        const token = await getToken(authorization);
        const data = await getJwtPayload(token);
        let email  = data.email;
    }else {

    }
}
    
}
