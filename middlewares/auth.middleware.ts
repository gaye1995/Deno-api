import { Application,Router,Request ,Response} from "https://deno.land/x/oak/mod.ts";
import EmailException from '../exception/EmailException.ts';
import {MiddlewareFunc} from 'https://deno.land/x/abc@v1.2.4/types.ts';
import { getAuthToken, getRefreshToken, getJwtPayload } from '../helpers/jwt.ts'


export const TokenMidd: MiddlewareFunc = (next) => async (data)=>{
   

}