
import { UserDB } from './../db/UserDB.ts';
import * as expressive from 'https://raw.githubusercontent.com/NMathar/deno-express/master/mod.ts';
import * as jwt from '../helpers/jwt.ts';
import { UserModels } from '../Models/UserModels.ts';
import UserInterfaces from '../interfaces/UserInterfaces.ts';
import { roleTypes } from '../types/rolesTypes.ts';
import { HandlerFunc } from 'https://deno.land/x/abc@v1.2.4/types.ts';
import { Context } from 'https://deno.land/x/abc@v1.2.4/context.ts';
import PasswordException from '../exception/PasswordException.ts';
import EmailException from '../exception/EmailException.ts';
import { Get } from "https://deno.land/x/abc@v1.2.4/_http_method.ts";


export class UsersControllers {


    static register: HandlerFunc = async(c: Context) => {

        let _userdb: UserDB = new UserDB();
        let userdb = _userdb.userdb;

        const data : any = await c.body;
                try {
            const user: any = await userdb.findOne({ email: data.email })
            if(user){
                c.response.body = "existe";
                c.response.status = 409;
                return { error: false, message: 'Email/password incorrect' };
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
            const token = {
                'access_token': jwt.getAuthToken(user),
                'refresh_token': jwt.getRefreshToken(user),
            };
            c.response.status = 200;
            return { error: false, message: "l'utilisateur a été authentifiée succés", data,token};
            }
        } catch (err) {
            c.response.status = 401;
            return { error: true, message: err.message };
        }
    }

    static login: HandlerFunc = async(c: Context) => {

        let _userdb: UserDB = new UserDB();
        let userdb = _userdb.userdb;

        let data : any = await c.body;

        try {
            const user: any = await userdb.findOne({ email: data.email })
            if(!user){
                c.response.status = 400;
                return { error: false, message: 'Email/password incorrect' };
            }
            else if(data == undefined)
            {
                return { error: false, message: 'Une ou plusieurs données obligatoire sont manquantes' };
            }
            else if(PasswordException.comparePassword(data.password, user.password ))
            {
                c.response.status = 400;
                return { error: false, message: 'Email/password incorrect' };
            }else {
                console.log(user);
           /*const token = {
                'access_token': jwt.getAuthToken(user),
                'refresh_token': jwt.getRefreshToken(user),
            };*/
            c.response.status = 200;
            let subs = data.subscription = true;
            return { 
                error: false,
                message: "l'utilisateur a bien été créé avec succés",
                user,
                subs,
            }
        }
        } catch (err) {
            c.response.status = 401;
            return { error: true, message: err.message };
        }
    }
    static modifuser: HandlerFunc = async(c: Context) => {

        let _userdb: UserDB = new UserDB();
        let userdb = _userdb.userdb;

        let { data }: any = c.body;

        try {

            

        }catch (err) {
            c.response.status = 401;
            return { error: true, message: err.message };
        }
    }
    static deleteuser: HandlerFunc = async(c: Context) => {

      
    } 
    static subscription: HandlerFunc = async(c: Context) => {
        let _userdb: UserDB = new UserDB();
        let userdb = _userdb.userdb;
      
    }
    
}

