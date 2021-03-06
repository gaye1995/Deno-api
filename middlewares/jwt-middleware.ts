import { Context } from 'https://deno.land/x/abc@v1.2.4/context.ts';
import UserInterfaces from '../interfaces/UserInterfaces.ts';
import { create, verify, decode, getNumericDate } from "https://deno.land/x/djwt@v2.0/mod.ts";
import { config } from '../config/config.ts';


const getToken =async (authHeader: any) =>{
        try{
            return await authHeader.replace(/^Bearer/i, "").trim();   
        }catch
        {
            return false;
        }
}
export { getToken }

const {
    STRIPE_SECRET_KEY,
    JWT_TOKEN_SECRET,
    JWT_ACCESS_TOKEN_EXP,
    JWT_REFRESH_TOKEN_EXP,
} = config;

const header: any = {
    alg: "HS256",
    typ: "JWT",
};

const getAuthToken = async (user: any) => {
    const payload: any = {
        iss: "deno-imie-api",
        email: user.email,
        roles: user.role,
        exp: getNumericDate(new Date().getTime() + parseInt(JWT_ACCESS_TOKEN_EXP)),
    };

    return await create(header, payload, JWT_TOKEN_SECRET);
};

const getRefreshToken = async(user: any) => {
    const payload: any = {
        iss: "deno-imie-api",
        email: user.email,
        exp: getNumericDate(new Date().getTime() + parseInt(JWT_REFRESH_TOKEN_EXP)),
    };

    return await create(header, payload, JWT_TOKEN_SECRET);
};

const getJwtPayload = async(token: string): Promise < any | null > => {
    try {
        const jwtObject = await verify(token, JWT_TOKEN_SECRET, header.alg);
        if (jwtObject) {
            return jwtObject;
        }
    } catch (err) {}
    return null;
};
const getJwtPayloadST = async(token: string): Promise < any | null > => {
    try {
        const jwtObject = await verify(token, STRIPE_SECRET_KEY, header.alg);
        if (jwtObject) {
            return jwtObject;
        }
    } catch (err) {}
    return null;
};


export { getAuthToken, getRefreshToken, getJwtPayload ,getJwtPayloadST };