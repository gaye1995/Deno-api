import { Application,Router,Request ,Response} from "https://deno.land/x/oak/mod.ts";
import EmailException from '../exception/EmailException.ts';
import {MiddlewareFunc} from 'https://deno.land/x/abc@v1.2.4/types.ts';
import { getAuthToken, getRefreshToken, getJwtPayload } from '../helpers/jwt.ts'
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";


export const TokenMidd: MiddlewareFunc = (next) => async (data)=>{
   

}
const hash = async(password: string):Promise<string>=>{
    return await bcrypt.hash(password);
}

const comparePass = async(password: string, hash: string):Promise<boolean> =>{
    return await bcrypt.compare(password, hash);
}

export { hash, comparePass };