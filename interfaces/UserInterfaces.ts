import { ChildsModels } from "../Models/ChildsModels.ts";
import { roleTypes } from '../types/rolesTypes.ts';
import { userUpdateTypes } from '../types/userUpdateTypes.ts';
import ChildsInterfaces from "./ChildsInterfaces.ts";

export default interface UserInterfaces {

    role: roleTypes;
    firstname: string;
    lastname: string;
    email: string;
    sexe: string;
    password: string;
    dateNaiss: Date;
    subscription?:number;
    childs?:  [{
        role: roleTypes;
        firstname: string;
        lastname: string;
        email: string;
        sexe: string;
        password: string;
        dateNaiss: Date;
         }];
  
    insert(): Promise < any > ;
    update(update:userUpdateTypes): Promise < any > ;
    delete(): Promise < any > ;
}
