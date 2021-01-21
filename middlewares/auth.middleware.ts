import { Application,Router,Request ,Response} from "https://deno.land/x/oak/mod.ts";
import EmailException from '../exception/EmailException.ts';
import {MiddlewareFunc} from 'https://deno.land/x/abc@v1.2.4/types.ts';
import { getAuthToken, getRefreshToken, getJwtPayload } from '../helpers/jwt.ts'


export const TokenMidd: MiddlewareFunc = (next) => async (data)=>{
    const url: any = data.params.pathname;
    if(url !== '/login'){
        const authorization: any = data.request.headers.get("authorization");
        if(!authorization){
            throw new Error();
        }
        const HeaderToken = authorization?.replace("Bearer ", "");
        if(!getAuthToken){
            throw new Error();
        }
       // const isValidToken= await getJwtPayload(HeaderToken)
           // if(isValidToken) throw new Error();
            
    }
    await next(data);
 

}