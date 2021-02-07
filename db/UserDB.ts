import { db } from './db.ts';
import UserInterfaces from '../interfaces/UserInterfaces.ts';
import CardInterfaces from '../interfaces/CardInterfaces.ts'
import { hash } from '../middlewares/auth.middleware.ts';
import { userUpdateTypes,SubscriptionUpdateTypes } from "../types/userUpdateTypes.ts";


export class UserDB{

    public userdb: any;
    public cartdb: any;

    
    constructor(){
        this.userdb = db.collection<UserInterfaces>("users");
        this.cartdb = db.collection<CardInterfaces>("cart");
    }

}
