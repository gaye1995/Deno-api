import { Code } from "https://deno.land/x/mongo@v0.20.1/bson/bson.d.ts";
import { hashSync, compareSync } from "https://deno.land/x/bcrypt@v0.2.1/mod.ts";
import { makeJwt, setExpiration, Jose } from "https://deno.land/x/djwt@v0.9.0/create.ts";
import { UserDB } from '../db/UserDB.ts'
import UserInterfaces from "../interfaces/UserInterfaces.ts";
import {UserModels} from '../Models/UserModels.ts'
import { hash } from '../helpers/password.helpers.ts'


export class UsersControllers {
    
    static login = async (req: Request, res: Response) =>{
        const header: Jose = {
            alg: 'HS256',
            typ: 'JWT'
          };
        let {data}: any = req.body ;
        try{
            const user1 = await userdb.findOne({ email: data.email });
            if(!user1)
            {
                 throw "user exist dejas"
            } else if (!compareSync(user1.password, data.password)) {
                throw 'password incorrect'
            }
            else {
                const payload = {
                    iss: user1.email,
                    exp: setExpiration(Date.now() + 1000 * 60 * 60)
                };
                const jwt = makeJwt({ key: Deno.env.get('JWT_KEY') || '', header, payload })
            }
              
            }catch{

        }
    }
}