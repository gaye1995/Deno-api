
import { UserDB } from './../db/UserDB.ts';
import * as jwt from '../middlewares/jwt-middleware.ts';
import { UserModels } from '../Models/UserModels.ts';
import { HandlerFunc } from 'https://deno.land/x/abc@v1.2.4/types.ts';
import { Context } from 'https://deno.land/x/abc@v1.2.4/context.ts';
import PasswordException from '../exception/PasswordException.ts';
import EmailException from '../exception/EmailException.ts';
import { hashSync, compareSync } from "https://deno.land/x/bcrypt@v0.2.1/mod.ts";
import { reset } from "https://deno.land/std@0.77.0/fmt/colors.ts";
import {getToken} from '../middlewares/jwt-middleware.ts'
import { getJwtPayload } from "../middlewares/jwt-middleware.ts";
import {mailRegister} from '../helpers/mails.ts'
import {incLoginAttempts} from '../utils/maxlock.ts'

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
                await mailRegister(User.email);
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
                console.log(await incLoginAttempts(user, user.loginAttempts))

                if(data.email == '' || data.password == ''){
                    c.response.status = 400;
                    return c.json({ error: true, message: "Email/password manquants" });
                }else if(!user || !(compareSync(data.password, user.password))){
                    return c.json({status:400, error: true, message: "password incorrect" });
                }
                //test nombre de tentatives
                else if(await incLoginAttempts(user, user.loginAttempts) > 5 )
                {
                    await userdb.updateOne(
                        { email: user.email },
                        {$set: {loginAttempts: 0}}); 
                
                    return c.json({ status: 429,error: true, message: "Trop de tentative sur l'email xxxxx (5 max) - Veuillez patienter (2min)"  });
                }
                else {
                    const updateToken = await userdb.updateOne(
                        { email: user.email },
                        {$set: {access_token: await jwt.getAuthToken(user)}});
                    const updateRToken = await userdb.updateOne(
                        { email: user.email },
                        {$set: {refresh_token: await jwt.getRefreshToken(user)}});
                    if(!updateRToken && !updateToken){
                        return c.json({ status : 201 ,error: true, message: "token n'a pas été mise à jour dans la BBD", user });
                    }
                    return c.json({ status : 200 ,error: false, message: "L'utilisateur a été authentifié succès", user });
                }
            }catch (err){
                c.response.status = 401;
                return { error: true, message: err.message };
            }
    }
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
            console.log(dataparent);
            if(data.firstname=="" || data.lastname=="" || data.email=="" || data.password=="" || data.dateNaiss=="" || data.sexe==""){
                return c.json({ status :400,error: true, message: "Une ou plusieurs données obligatoire sont manquantes" })
            }
            else if(!token){
                return c.json({Error: true, message: "Votre token n'est pas correct"});
            }else if(!PasswordException.isValidPassword(data.password) || EmailException.checkEmail(data.email))
            {
                return c.json({status:409, error: true, message: "Une ou plusieurs données sont erronées" });
            }else if(user1){
                console.log(user1.email);
                c.response.status = 409;
                return c.json({ status:409, error: true, message: "Un compte utilisant cette adresse mail est déjà enregistré" });
            }else if((await userdb.count({idparent: userParent._id})) >= 3){
               c.json({ error: true, message: "Vous avez dépassé le cota de trois enfants" });
            }
            else{
                console.log(await userdb.count({idparent: userParent._id}));
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
                    const nbenfant = await userdb.count({ idparent: userParent._id});
                    (nbenfant > 3 ) ? c.json({ error: true, message: "Vous avez dépassé le cota de trois enfants" }) : 
                    await User.insert();
                    await userdb.updateOne({
                        email:userParent.email
                    },{$set: {role: 'Parent'}})
                    console.log(userParent.role);
                return c.json({status:200, error: false, message: "Votre enfant a bien été créé avec succès",User});
            }    
        }catch (err){
            return c.json({ status:401,error: true, message: err.message });
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
        //const dataenfant = await userdb.findOne({_id: user.})
        console.log(user.email);
        if(!authorization && await getJwtPayload(token)){
            return c.json({ status : 401,error: true, message: "Votre token n'est pas correct" });
        }else if(!user.idparent && !user.id){
            return c.json({status: 403, error: true, message: "Vous ne pouvez pas supprimer cet enfant" });
        }
        const deleteCount = await userdb.deleteOne({ _id: user._id });
        if(!deleteCount){
            return c.json({ status : 200,error: true, message: "Votre compte n'a pas été supprimés avec succès" });
        }else{
            return c.json({ status : 200,error: false, message: "L'utilisateur a été supprimée avec succès" });
        }
      
} 
static deleteuser: HandlerFunc = async(c: Context) => {
    let _userdb: UserDB = new UserDB();
    let userdb = _userdb.userdb;
    const authorization: any = c.request.headers.get("authorization");
        const token = await getToken(authorization);
        const data = await getJwtPayload(token);
        const user: any = await userdb.findOne({ email: data.email });
        console.log(user.email);
        if(!token){
            return c.json({ status : 401,error: true, message: "Votre token n'est pas correct" });
        }
        const deleteCount = await userdb.deleteOne({ _id: user._id });
        if(!deleteCount){
            return c.json({ status : 200,error: true, message: "Votre compte n'a pas été supprimés avec succès" });
        }else{
            await userdb.deleteMany({idparent: user._id});
            return c.json({ status : 200,error: false, message: "Votre compte et le compte de vos enfants ont été supprimés avec succès" });
        }
    
}
static offuser: HandlerFunc = async(c: Context) => {
    let _userdb: UserDB = new UserDB();
    let userdb = _userdb.userdb;
    const authorization: any = c.request.headers.get("authorization");
        const token = await getToken(authorization);
        const data = await getJwtPayload(token);
        const user: any = await userdb.findOne({ email: data.email });
        if(!authorization && await getJwtPayload(token)){
            return c.json({ status : 401,error: true, message: "Votre token n'est pas correct" });
        }
        const deconnectCount = await userdb.deleteOne({ token: user.access_token });
        if(!deconnectCount){
            return c.json({ status : 201,error: true, message: "Votre compte n'a pas été déconnecté " });
        }else{
            return c.json({ status : 200,error: false, message: "L'utilisateur a été déconnecté avec succès" } );
        }
      
} 
static facture: HandlerFunc = async(c: Context) => {
    let _userdb: UserDB = new UserDB();
    let userdb = _userdb.userdb;
    const authorization: any = c.request.headers.get("authorization");
        const token = await getToken(authorization);
        const data = await getJwtPayload(token);
        const user: any = await userdb.findOne({ email: data.email });
        if(!authorization && await getJwtPayload(token)){
            return c.json({ status : 401,error: true, message: "Votre token n'est pas correct" });
        }else if(user.subscription == 0){
            return c.json({status: 403, error: true, message: "Vos droits d'accès ne permettent pas d'accéder à la ressource" });
        }else{
            return c.json({ status : 200,error: false, bills:[] } );
        }
      
}
static allUserChild: HandlerFunc = async(c: Context) => {
    let _userdb: UserDB = new UserDB();
    let userdb = _userdb.userdb;
    const authorization: any = c.request.headers.get("authorization");
        const token = await getToken(authorization);
        const data = await getJwtPayload(token);
        const userParent: any = await userdb.findOne({ email: data.email });
        if(!authorization && await getJwtPayload(token)){
            return c.json({ status : 401,error: true, message: "Votre token n'est pas correct" });
        }else if(userParent.subscription == 0){
            return c.json({status: 403, error: true, message: "Vos droits d'accès ne permettent pas d'accéder à la ressource" });
        }else{
        //    const users : any = await userdb.find({idparent :userParent._id});
           const allchild = await userdb.find({idparent :userParent._id}).toArray();
           console.log(allchild)
           return c.json({Error :false,allchild});
        
        }
      
}
}