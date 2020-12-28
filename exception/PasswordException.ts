import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

export default class EmailException extends Error {

    constructor() {
        super('password is not valid')
    }
static hash = async(password: string):Promise<string>=>{
    return await bcrypt.hash(password);
}

static comparePass = async(password: string, hash: string):Promise<boolean> =>{
    return await bcrypt.compare(password, hash);
}
}