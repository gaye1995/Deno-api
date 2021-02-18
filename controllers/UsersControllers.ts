
import { UserDB } from './../db/UserDB.ts';
import * as jwt from '../middlewares/jwt-middleware.ts';
import { UserModels } from '../Models/UserModels.ts';
import { HandlerFunc } from 'https://deno.land/x/abc@v1.2.4/types.ts';
import { Context} from 'https://deno.land/x/abc@v1.2.4/context.ts';
import PasswordException from '../exception/PasswordException.ts';
import EmailException from '../exception/EmailException.ts';
import { hashSync, compareSync } from "https://deno.land/x/bcrypt@v0.2.1/mod.ts";
import { reset } from "https://deno.land/std@0.77.0/fmt/colors.ts";
import {getToken} from '../middlewares/jwt-middleware.ts'
import { getJwtPayload } from "../middlewares/jwt-middleware.ts";
import {mailRegister} from '../helpers/mails.ts';
import {incLoginAttempts} from '../utils/maxlock.ts';
import { sexeTypes } from "../types/rolesTypes.ts";
export class UsersControllers {

// Route d'authentification
static login: HandlerFunc = async(c: Context) => {

        let _userdb: UserDB = new UserDB();
        let userdb = _userdb.userdb;
        let data : any = await c.body;
        try {
            const user: any = await userdb.findOne({ email: data.email })
            if(data.email == '' || data.password == ''){
                return c.json({ error: true, message: "Email/password manquants" },400);
            }else if(!user || !(compareSync(data.password, user.password))){
                return c.json({error: true, message: "Email/password incorrect" },400);
            }
            //test nombre de tentatives
            else if(await incLoginAttempts(user, user.loginAttempts) > 5 )
            {
                await userdb.updateOne(
                    { email: user.email },
                    {$set: {loginAttempts: 0}});
            
                return c.json({error: true, message: "Trop de tentative sur l'email "+ user.email +"(5 max) - Veuillez patienter (2min)"  },429);
            }
            else {
                const updateToken = await userdb.updateOne(
                    { email: user.email },
                    {$set: {access_token: await jwt.getAuthToken(user)}});
                const updateRToken = await userdb.updateOne(
                    { email: user.email },
                    {$set: {refresh_token: await jwt.getRefreshToken(user)}});
                if(!updateRToken && !updateToken){
                    return c.json({error: true, message: "token n'a pas été mise à jour dans la BBD", user },201);
                }
                console.log("utilisateur" + user)
               let  newUser = {
                "role": user.role,
                "firstname": user.firstname,
                "lastname": user.lastname,
                "email": user.email,
                "sexe": user.sexe,
                "dateNaiss" :user.dateNaissance,
                "subscription":user.subscription,
                "createdAt":user.createdAt,
                "updatedAt": user.updatedAt,
                "acess": user.access_token

               }

                if(user) return c.json({error: false, message: "L'utilisateur a été authentifié succès", user: newUser },200);

            }
        }catch (err){
            c.response.status = 401;
            return { error: true, message: err.message };
        }
}
// Route register - to verify
static register: HandlerFunc = async(c: Context) => {

        let _userdb: UserDB = new UserDB();
        let userdb = _userdb.userdb;
            try {
            const data : any = await c.body;
            const user: any = await userdb.findOne({ email: data.email })
            if(data.firstname=="" || data.lastname=="" || data.email=="" || data.password=="" || data.sexe=="" || data.dateNaissance==""){
                return c.json({error: true, message: "Une ou plusieurs données obligatoire sont manquantes" }, 400);
            }else if(EmailException.checkEmail(data.email) || PasswordException.isValidPassword(data.password))
            {
                return c.json({ error: true, message: "Une ou plusieurs données sont erronées" },409);
            }
            else if(user)
            {
                return c.json({ error: true, message: "Un compte utilisant cette adresse mail est déjà enregistré" },409);           
            }
            else{
                const pass = await PasswordException.hashPassword(data.password);
                const User = new UserModels(
                    'Tuteur',
                    data.firstname,
                    data.lastname,
                    data.email,
                    data.sexe.sexeTypes,
                    pass,
                    data.dateNaissance,
                    );
                await User.insert();
                await mailRegister(User.email);
                // return c.json({ error: false, message: "L'utilisateur a bien été créé avec succès",User},201);
                 let  newUser = {
     
                    "firstname": User.firstname,
                    "lastname": User.lastname,
                    "email": User.email,
                    "sexe": User.sexe,
                    "role": User.role,
                    "dateNaissance": User.dateNaissance,
                    "createdAt": User.createdAt,
                    "updatedAt": User.updatedAt,
                    "subscription": User.subscription
    
                   }
                    if(User) return c.json({error: false, message: "L'utilisateur a bien été créé avec succès", user: newUser },201);
            }
        }catch (err) {
            return c.json({ error: true, message: err.message },401);
        }
}
//Ajout d'un nouvel utilisateur enfant
static userchild: HandlerFunc = async(c: Context) => {
        let _userdb: UserDB = new UserDB();
        let userdb = _userdb.userdb;
        try {
        const authorization: any = c.request.headers.get("authorization");
            const token = await getToken(authorization);
            const dataparent = await getJwtPayload(token);
            const userParent: any = await userdb.findOne({ email: dataparent.email });
            const data : any = await c.body;
            const user1: any = await userdb.findOne({ email: data.email });
            if(data.firstname=="" || data.lastname=="" || data.email=="" || data.password=="" || data.dateNaissance=="" || data.sexe==""){
                return c.json({error: true, message: "Une ou plusieurs données obligatoire sont manquantes" },400)
            }
            else if(!authorization || !token){
                return c.json({Error: true, message: "Votre token n'est pas correct"});
            } else if(userParent.subscription == 0){
                return c.json({ error: true, message: "Vos droits d'accès ne permettent pas d'accéder à la ressource" },403);
            }else if(PasswordException.isValidPassword(data.password) || EmailException.checkEmail(data.email))
            {
                return c.json({error: true, message: "Une ou plusieurs données sont erronées" },409);
            }else if(user1){
                return c.json({ error: true, message: "Un compte utilisant cette adresse mail est déjà enregistré" },409);

            }else if((await userdb.count({idparent: userParent._id})) >= 3){
               return c.json({ error: true, message: "Vous avez dépassé le cota de trois enfants" },409);
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
                    //const nbenfant = await userdb.count({ idparent: userParent._id});
                   // (nbenfant > 3 ) ? c.json({ error: true, message: "Vous avez dépassé le cota de trois enfants" }) : 
                    await User.insert();
                    await userdb.updateOne({
                        email:userParent.email
                    },{$set: {role: 'Parent'}})
                    await userdb.updateOne({
                        email:User.email
                    },{$set: {subscription: 1}})
                    let  newUser = {
     
                        "firstname": User.firstname,
                        "lastname": User.lastname,
                        "sexe": User.sexe,
                        "role": User.role,
                        "dateNaissance": User.dateNaissance,
                        "createdAt": User.createdAt,
                        "updatedAt": User.updatedAt,
                        "subscription": userParent.subscription
        
                       }
                        if(User) return c.json({error: false, message: "Votre enfant a bien été créé avec succès", user: newUser },200);
            }    
        }catch (err){
            return c.json({error: true, message: "Votre token n'est pas correct"},401);
        }
}
//delete child en utilisant son propre token
static deleteuserchild: HandlerFunc = async(c: Context) => {
    let _userdb: UserDB = new UserDB();
    let userdb = _userdb.userdb;
    const authorization: any = c.request.headers.get("authorization");
        const token = await getToken(authorization);
        const data = await getJwtPayload(token);
        const user: any = await userdb.findOne({ email: data.email });
        if(!authorization && await getJwtPayload(token)){
            return c.json({ error: true, message: "Votre token n'est pas correct" },401);
        }else if(user.subscription == 0){
            return c.json({ error: true, message: "Vos droits d'accès ne permettent pas d'accéder à la ressource" },403);
        }else if(!user.idparent && !user.id){

            return c.json({ error: true, message: "Vous ne pouvez pas supprimer cet enfant" },403);
        }

        const deleteCount = await userdb.deleteOne({ idparent :user._id});
        if(!deleteCount){
            return c.json({ error: true, message: "Votre compte n'a pas été supprimés avec succès" },403);
        }else{
            return c.json({ error: false, message: "L'utilisateur a été supprimée avec succès" },200);
        }
      
} 
//delete child en utilisant son propre token - to verify -  success 200
static subscriber: HandlerFunc = async(c: Context) => {
    let _userdb: UserDB = new UserDB();
    let userdb = _userdb.userdb;
    const authorization: any = c.request.headers.get("authorization");
        const token = await getToken(authorization);
        const data = await getJwtPayload(token);
        const user: any = await userdb.findOne({ email: data.email });
        //const dataenfant = await userdb.findOne({_id: user.})
        if(!authorization && await getJwtPayload(token)){
            return c.json({error: true, message: "Votre token n'est pas correct" },401);
        } else
        {
            await userdb.updateOne(
                { email: user.email },
                {$set: {subscription: 1}}); 
            return c.json({error: false, message: "Votre abonnement a bien été mise à jour", user: user }, 200);
        }
} 
// suppression d'un utilisateur 
static deleteuser: HandlerFunc = async(c: Context) => {
    let _userdb: UserDB = new UserDB();
    let userdb = _userdb.userdb;
    try{
    const authorization: any = c.request.headers.get("authorization");
        const token = await getToken(authorization);
        if(!token){
            return c.json({ error: true, message: "Votre token n'est pas correct" },401);
        }
        const data = await getJwtPayload(token);
        const user: any = await userdb.findOne({ email: data.email });
        const deleteCount = await userdb.deleteOne({ _id: user._id });
        if(!deleteCount){
            return c.json({ error: true, message: "Votre compte n'a pas été supprimés avec succès" },403);
        }else{
            await userdb.deleteMany({idparent: user._id});
            return c.json({error: false, message: "Votre compte et le compte de vos enfants ont été supprimés avec succès" },200);
        }
    }catch(err){
        return c.json({ error: true, message: "Votre token n'est pas correct" },401);
    }
    
}
//deconnexion
static offuser: HandlerFunc = async(c: Context) => {
    let _userdb: UserDB = new UserDB();
    let userdb = _userdb.userdb;
    try{ 
    const authorization: any = c.request.headers.get("authorization");
        const token = await getToken(authorization);
        const data = await getJwtPayload(token);
        const user: any = await userdb.findOne({ email: data.email });
        if(!authorization && await getJwtPayload(token)){
            return c.json({error: true, message: "Votre token n'est pas correct" },401);
        }
        const deconnectCount = await userdb.deleteOne({ token: user.token });
        if(!deconnectCount){

            return c.json({ error: true, message: "Votre compte n'a pas été déconnecté " },403);
        }else{
            return c.json({error: false, message: "L'utilisateur a été déconnecté avec succès" } ,200);
        }

    }catch(err){
        return c.json({error: true, message: "Votre token n'est pas correct" },401);
    }
      
} 
static facture: HandlerFunc = async(c: Context) => {
    let _userdb: UserDB = new UserDB();
    let userdb = _userdb.userdb;
    const authorization: any = c.request.headers.get("authorization");
        const token = await getToken(authorization);
        const data = await getJwtPayload(token);
        const user: any = await userdb.findOne({ email: data.email });
        if(!authorization || await getJwtPayload(token)){
            return c.json({ error: true, message: "Votre token n'est pas correct" },401);
        }else if(user.subscription == 0){
            return c.json({error: true, message: "Vos droits d'accès ne permettent pas d'accéder à la ressource" },403);
        }else{
            return c.json({error: false, bills:[] },200 );
        }
      
}
// Listage d' enfants
static allUserChild: HandlerFunc = async(c: any) => {

    let _userdb: UserDB = new UserDB();
    let userdb = _userdb.userdb;
    try {
    const authorization: any = c.request.headers.get("authorization");
        const token = await getToken(authorization);
        const dataparent = await getJwtPayload(token);
        const userParent: any = await userdb.findOne({ email: dataparent.email })
        const data : any = await c.body;
        const user: any = await userdb.findOne({ email: data.email })
        if(data.email=="" || data.password=="" ){
            return c.json({ error: true, message: "Une ou plusieurs données obligatoire sont manquantes" },400)
        }
        else if(user.role !== "Parent"){
            return c.json({ error: true, message: "Votre droits d'accès ne permettent pas d'accéder à la ressource"},403);
        }
        else if(!PasswordException.isValidPassword(data.password) || EmailException.checkEmail(data.email)){
            return c.json({ error: true, message: "Une ou plusieurs données sont erronées" },409);
        }
        else{
          //recupération de la liste des enfants par parent
          const users = await userdb.find({idparent :userParent._id}).toArray();
          users.map((maListe: any ) =>{
            Object.assign(maListe,{_id:maListe._id});
                delete maListe.email
                delete maListe.access_token
                delete maListe.refresh_token
                delete maListe.loginAttempts
                delete maListe.lockUntil
                delete maListe.idparent
                delete maListe._id
                delete maListe.password

          })
          if (users) return c.json({Error :false,users});
          else return [];
        }
    }
    catch (err) {
        return c.json({Error: true, message: "Votre token n'est pas correct"},401);
    }

}
// Modification de l'utilisateur
static updateUser: HandlerFunc = async(c: any) => {
  
    let _userdb: UserDB = new UserDB();
    let userdb = _userdb.userdb;
        try {
        const authorization: any = c.request.headers.get("authorization");
        const token = await getToken(authorization);
        const data : any = await c.body;
        const user: any = await userdb.findOne({ email: data.email })
        console.log(data.email);
         if(!token){
            return c.json({Error: true, message: "Votre token n'est pas correct"},401);
         }
        else if(PasswordException.isValidPassword(data.password) || EmailException.checkEmail(data.email)){
                return c.json({error: true, message: "Une ou plusieurs données sont erronées" },409);
        }
        else if(!user || !(compareSync(data.password, user.password))){
            return c.json({error: true, message: "Email/password incorrect" },400);
        }
        else{
            console.log(user.email);
            let update = await userdb.updateOne({ email: user.email }, { $set: { firstname: data.firstname,lastname: data.lastname}} );
            if(!update){
                return c.json({ error: true, "message": "Une ou plusieurs données sont erronées" },409);
            }
             // let update = await userdb.updateOne({ email: user.email },{ ...data, email: user.email })
            console.log(data.lastname);
            console.log(data.firstname);
            return c.json({ error: false, message: "Vos données ont été mises à jour"},200);
           
        }
    }catch (err) {
        return c.json({Error: true, message: "Votre token n'est pas correct"},401);
    }
}

}