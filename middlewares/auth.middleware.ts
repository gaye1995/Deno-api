import { Application,Router,Request ,Response} from "https://deno.land/x/oak/mod.ts";
import EmailException from '../exception/EmailException.ts';
import {MiddlewareFunc} from 'https://deno.land/x/abc@v1.2.4/types.ts';
import { getAuthToken, getRefreshToken, getJwtPayload } from '../helpers/jwt.ts'
import { Context,REDIRECT_BACK } from "https://deno.land/x/oak/mod.ts";


export const TokenMidd: MiddlewareFunc = (next) => async (data)=>{
   

}
 //Define authMiddleware to check session validity
const authMiddleware = async (c: any, next: any) => {
    let _userdb: UserDB = new UserDB();
            let userdb = _userdb.userdb;
    //Check if the session exists
const hadEmployee = await c.state.session.get("USER_SESSION");
if(hadEmployee  !== undefined){
    await next();
    return;
}
    //Otherwise transfer to the login page
c.response.redirect(REDIRECT_BACK, "/");
}