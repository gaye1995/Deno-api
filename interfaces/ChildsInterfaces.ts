import { roleTypes } from '../types/rolesTypes.ts';
import { userUpdateTypes } from '../types/userUpdateTypes.ts';

export default interface ChildsInterfaces {

    
    role: roleTypes;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    dateNaiss: Date;
    sexe: string;
    subscription?:number;
    nb_enfants? : number;
    childs?: ChildsInterfaces;
    
  
    insert(): Promise < any > ;
    update(update:userUpdateTypes): Promise < any > ;
    delete(): Promise < any > ;
}
