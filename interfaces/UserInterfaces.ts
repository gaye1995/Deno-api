import { roleTypes } from '../types/rolesTypes.ts';
import { userUpdateTypes } from '../types/userUpdateTypes.ts';
import { Bson } from "https://deno.land/x/bson/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.20.1/src/utils/bson.ts";

export default interface UserInterfaces {
    role: roleTypes;
    firstname: string;
    lastname: string;
    email: string;
    sexe: string;
    password: string;
    dateNaissance: Date;
    subscription?:number;
    access_token: string;
    refresh_token: string;
    idparent? : { $oid: string } | string;
    loginAttempts :number;
    lockUntil :number;
 
    createdAt: Date;
    updatedAt : Date;
  
    insert(): Promise < any > ;
    update(update:userUpdateTypes): Promise < any > ;
    delete(): Promise < any > ;
    
}
