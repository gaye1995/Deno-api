import { monthTypes, roleTypes, yearTypes } from '../types/rolesTypes.ts';
import { userUpdateTypes } from '../types/userUpdateTypes.ts';

export default interface CardInterfaces {
    cartNumber: string;
    month: Number;
    year: Number;
    Default: string;
    createdAt: Date;
    updatedAt : Date;
    
}
