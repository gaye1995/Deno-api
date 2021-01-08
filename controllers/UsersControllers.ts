import { compareSync } from "https://deno.land/x/bcrypt@v0.2.1/mod.ts";
import  {UserDB}  from '../db/UserDB.ts'
import * as expressive from 'https://raw.githubusercontent.com/NMathar/deno-express/master/mod.ts';
import * as jwt from '../helpers/jwt.ts';
import {UserModels} from '../Models/UserModels.ts';
import UserInterfaces from '../interfaces/UserInterfaces.ts';
import { roleTypes } from "../types/rolesTypes.ts";



export class UsersControllers extends UserDB {

    
    static login = async(req: any, res: any) => {

      
        let {data}: any = req.body ;

     try {
         const user = await userdb.findOne({ email: data.email })
         if (!user){
             res.status = 401
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
}