import { roleTypes } from '../types/rolesTypes.ts';
import { userUpdateTypes } from '../types/userUpdateTypes.ts';

export default interface CardInterfaces {
    cartNumber: string;
    month: Date;
    year: Date;
    Default: string;
    idUsers : string;
    createdAt: Date;
    updatedAt : Date;
    
}
