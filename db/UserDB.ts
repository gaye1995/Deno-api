import { db } from './db.ts';
import UserInterfaces from '../interfaces/UserInterfaces.ts';
import { userUpdateTypes,SubscriptionUpdateTypes } from "../types/userUpdateTypes.ts";

export class UserDB{

    public userdb: any;
    
    constructor(){
        this.userdb = db.collection<UserInterfaces>("users");
    }

    insert(): Promise < any > {
        throw new Error('Method not implemented.');
    }
    update(update:userUpdateTypes): Promise < any > {
        throw new Error('Method not implemented.');
    }
    updateSubscription(updateSubscription:SubscriptionUpdateTypes): Promise < any > {
        throw new Error('Method not implemented.');
    }
    delete(): Promise < any > {
        throw new Error('Method not implemented.');
    }
}
