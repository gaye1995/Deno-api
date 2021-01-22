import { roleTypes } from '../types/rolesTypes.ts';
import { userUpdateTypes } from '../types/userUpdateTypes.ts';

export default interface ChildsInterfaces {

    role: roleTypes;
    email: string;
    password: string;
    lastname: string;
    firstname: string;
    dateNaiss: Date;
    sexe: string;
    subscription:number;
    
  
    insert(): Promise < any > ;
    update(update:userUpdateTypes): Promise < any > ;
    delete(): Promise < any > ;
}
