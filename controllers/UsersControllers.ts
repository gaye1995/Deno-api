
import { UserDB } from './../db/UserDB.ts';
import * as expressive from 'https://raw.githubusercontent.com/NMathar/deno-express/master/mod.ts';
import * as jwt from '../helpers/jwt.ts';
import { UserModels } from '../Models/UserModels.ts';
import UserInterfaces from '../interfaces/UserInterfaces.ts';
import { roleTypes } from '../types/rolesTypes.ts';
import { HandlerFunc } from 'https://deno.land/x/abc@v1.2.4/types.ts';
import { Context } from 'https://deno.land/x/abc@v1.2.4/context.ts';
import { hashSync, compareSync } from "https://deno.land/x/bcrypt@v0.2.1/mod.ts";



export class UsersControllers {

    static test: HandlerFunc = async(c: Context) => {

        console.log('ok');

        return c.params;
    }

    static login: HandlerFunc = async(c: Context) => {

        console.log('ok');

        let _userdb: UserDB = new UserDB();
        let userdb = _userdb.userdb;

        let { data }: any = c.body;

        try {
            const user: any = await userdb.findOne({ email: data.email })
            if(!user) {
                c.response.status = 400;
                return { error: false, message: 'Email/password incorrect' };
            }else if(!compareSync(data.password, user.password ))
            {
                c.response.status = 400;
                return { error: false, message: 'Email/password incorrect' };
            }else {
            
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