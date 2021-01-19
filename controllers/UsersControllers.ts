
import { UserDB } from './../db/UserDB.ts';
import * as expressive from 'https://raw.githubusercontent.com/NMathar/deno-express/master/mod.ts';
import * as jwt from '../helpers/jwt.ts';
import { UserModels } from '../Models/UserModels.ts';
import UserInterfaces from '../interfaces/UserInterfaces.ts';
import { roleTypes } from '../types/rolesTypes.ts';
import { HandlerFunc } from 'https://deno.land/x/abc@v1.2.4/types.ts';
import { Context } from 'https://deno.land/x/abc@v1.2.4/context.ts';
import PasswordException from '../exception/PasswordException.ts';
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

export class UsersControllers {
    // Route 1 => /Inscription
    static register: HandlerFunc = async(c: Context) => {

        let _userdb: UserDB = new UserDB();
        let userdb = _userdb.userdb;

        let { data }: any = c.request.body;
        try {
            const user: any = await userdb.findOne({ email: data.email })
            if(user){
                c.response.status = 409;
                return { error: false, message: 'Email/password incorrect' };
            }else{
                const pass = await PasswordException.hashPassword(data.password);
                const User = new UserModels(
                    data.email,
                    pass,
                    data.lastname,
                    data.firstname,
                    data.role,
                    data.phoneNumber,
                );
                await User.insert();
            const token = {
                'access_token': jwt.getAuthToken(user),
                'refresh_token': jwt.getRefreshToken(user),
            };
            c.response.status = 200;
            return { error: false, message: "l'utilisateur a été authentifiée succés", user};
            }
        } catch (err) {
            c.response.status = 401;
            return { error: true, message: err.message };
        }
    }
    // Route 2 => /login (route d'authentifiaction d'un utilisateur)
    static login: HandlerFunc = async(c: Context) => {

        let _userdb: UserDB = new UserDB();
        let userdb = _userdb.userdb;

        let { data }: any = c.body;

        try {
            const user: any = await userdb.findOne({ email: data.email })
            if(data == undefined)
            {
                return { error: false, message: 'Une ou plusieurs données obligatoire sont manquantes' };
            }
            else if(!user){
                c.response.status = 400;
                return { error: false, message: 'Email/password incorrect' };
            }else if(PasswordException.comparePassword(data.password, user.password ))
            {
                c.response.status = 400;
                return { error: false, message: 'Email/password incorrect' };
            }else {
            
            const token = {
                'access_token': jwt.getAuthToken(user),
                'refresh_token': jwt.getRefreshToken(user),
            };
            c.response.status = 200;
            return { error: false, message: "l'utilisateur a bien été créé avec succés",user
            };
            }
        } catch (err) {
            c.response.status = 401;
            return { error: true, message: err.message };
        }
    }
    // Route 5 => /user ( route de modification d'un utilisateur)
    static modifuser: HandlerFunc = async(c: Context) => {

        let _userdb: UserDB = new UserDB();
        let userdb = _userdb.userdb;

        let { firstname, lastnamme, date_naissance, sexe, email, oldPassword, newPassword }: any = c.body;

        try {
            if (!firstname || !lastnamme || !date_naissance || !sexe || !email || !oldPassword || !newPassword) {
                c.response.status = 409;
                return { error: false, message: 'Une ou plusieurs données sont éronnés' };
            }
            const pass = await PasswordException.comparePassword(oldPassword, userdb.password);
          
            if (!pass){ 
                c.response.status = 409;
                return { error: false, message: "Email/password incorrect" };
            }
            userdb.password = newPassword;
            await userdb.insert();

            c.response.status = 200;
            return { error: true, message: "Vos données ont été mises à jours" };

        }catch (err) {
            c.response.status = 401;
            return { error: true, message: "Votre token n'est pas correct" };
        }
    }
    // Route 6 => Disconnect user (deconnexion d'un utilisateur)
    static disconnectUser: HandlerFunc = async(c: Context) => {
        let _userdb: UserDB = new UserDB();
        let userdb = _userdb.userdb;
        let { data }: any = c.request.body;
        try{
            const user: any = await userdb.findOne({ email: data.email })
            const token = await user.generateAuthToken();
            const refresh_token = await user.generateAuthRefreshToken();
            user.token = undefined;
            user.refresh_token = undefined;

            await user.save();
            c.response.status = 200;
            return { error: false, message: "L'utilisateur a été déconnecté avec succés"};
        }
        catch (err) {
            c.response.status = 401;
            return { error: true, message: "Votre token n'est pas correct" };
        }
    
    }
    // Route 8 => Delete new child user (suppression d'un nouvel utilisateur enfant)
    static deleteUserChild: HandlerFunc = async(c: Context) => {
        let _userdb: UserDB = new UserDB();
        let userdb = _userdb.userdb;

        let { email }: any = c.request.body;
        try{
            if(!userdb || !userdb.id || !email){
                c.response.status = 403;
                return { error: false, message: 'Votre droits d\'accès  ne permettent  pas d\'accèder à la ressource' };
            }
            const user = await userdb.deleteOne({email: email.email}); 
            await userdb.deleteOne(user);
            c.response.status = 200;
            return { error: false, message: "l'utilisateur a bien été supprimé avec succés"};
        
        }
        catch (err) {
            c.response.status = 401;
            return { error: true, message: "Votre token n\'est pas correct" };
        }
    }  


}

/*import  {UserDB}  from './../db/UserDB.ts';
import * as jwt from '../helpers/jwt.ts';
export class UsersControllers extends UserDB {
    constructor()
    {
        super();
    }
    static login = async(req: any, res: any) => {  
    let {data}: any = req.body ;
     try {
         const user = await userdb.findOne({ email: data.email })
         if (!user){
             res.status = 401;
             return res.json({ error: true, message: 'login error' });
         }const token = {
             "access_token": jwt.getAuthToken(user),
             "refresh_token": jwt.getRefreshToken(user),
         }
         res.status = 200;
         return res.json(token);
     } catch (err) {
         res.status = 401;
         return res.json({ error: true, message: err.message });
     }
}
}*/