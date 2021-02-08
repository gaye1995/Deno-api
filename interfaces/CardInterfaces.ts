import { monthTypes, roleTypes, yearTypes } from '../types/rolesTypes.ts';
import { userUpdateTypes } from '../types/userUpdateTypes.ts';

export default interface CardInterfaces {
    cartNumber: string;
    month: monthTypes;
    year: yearTypes;
    Default?: string;
    idUsers : { $oid: string } | string;
    createdAt: Date;
    updatedAt : Date;
    
}
