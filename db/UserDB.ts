import { db } from './db.ts';
import UserInterfaces from '../interfaces/UserInterfaces.ts';
import { hash } from '../middlewares/auth.middleware.ts';
import { userUpdateTypes,SubscriptionUpdateTypes } from "../types/userUpdateTypes.ts";


export class UserDB{

    public userdb: any;

    
    constructor(){
        this.userdb = db.collection<UserInterfaces>("users");
        //this.userenfant = db.collection<UserInterfaces>("enfants");
    }

}
