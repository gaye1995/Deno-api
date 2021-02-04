import { Context } from 'https://deno.land/x/abc@v1.2.4/context.ts';
import UserInterfaces from '../interfaces/UserInterfaces.ts';
import { config } from '../config/config.ts';

const getToken =async (authHeader: any) =>{
        try{
            return await authHeader.replace(/^bearer/i, "").trim();   
        }catch
        {
            return false;
        }
}
export { getToken }