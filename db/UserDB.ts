import { db } from './db.ts';
import UserInterfaces from '../interfaces/UserInterfaces.ts';
import { hash } from '../helpers/password.helpers.ts';
import { userUpdateTypes,SubscriptionUpdateTypes } from "../types/userUpdateTypes.ts";

export class UserDB{

    public userdb: any;
    public userenfant: any;

    
    constructor(){
        this.userdb = db.collection<UserInterfaces>("users");
        //this.userenfant = db.collection<UserInterfaces>("enfants");
    }

    async insert(): Promise < any > {
        this.userdb.password = await hash(this.userdb.password);
        this.userdb.email = await this.userdb.insertOne({
            role: this.userdb._role,
            firstname: this.userdb.firstname,
            lastname: this.userdb.lastname,
            email: this.userdb.email,
            password: this.userdb.password,
            dateNaiss: this.userdb.dateNaiss,
            sexe: this.userdb.sexe,
            phoneNumber: this.userdb.phoneNumber,
            subscription: this.userdb.subscription ,
            nb_enfants: this.userdb.nb_enfants,

        });
    }
   async update(update:userUpdateTypes): Promise < any > {
        const { modifiedCount } = await this.userdb.updateOne(
            { email: this.userdb.email },
            { $set: update }
          ); 
       }
   async updateSubscription(updateSubscription:SubscriptionUpdateTypes): Promise < any > {
        const { modifiedCount } = await this.userdb.updateOne(
            { email: this.userdb.email },
            { $set: {subscription: 1} }
          );
          if(modifiedCount) return this.userdb.subscription;
          return false; 
}
    delete(): Promise < any > {
        throw new Error('Method not implemented.');
    }
}
