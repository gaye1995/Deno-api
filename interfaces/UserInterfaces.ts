import { roleTypes } from '../types/rolesTypes.ts';
import { userUpdateTypes } from '../types/userUpdateTypes.ts';

export default interface UserInterfaces {

    role: roleTypes;
    email: string;
    password: string;
    lastname: string;
    firstname: string;
    dateNaissance: Date;
    sexe: string;
    access_token:string;
    refresh_token:String;
  
    insert(): Promise < any > ;
    update(update:userUpdateTypes): Promise < any > ;
    delete(): Promise < any > ;
}
