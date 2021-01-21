import { UserDB } from './../db/UserDB.ts';
import type { roleTypes } from '../types/rolesTypes.ts';
import { hash } from '../helpers/password.helpers.ts';
import UserInterfaces from '../interfaces/UserInterfaces.ts';
import type { SubscriptionUpdateTypes } from '../types/userUpdateTypes.ts';
import { reset } from "https://deno.land/std@0.77.0/fmt/colors.ts";

export class SubscriptionModels extends UserDB {

    private id: { $oid: string } | null = null;

    subscription: number ;

    constructor() {
        super();
        this.subscription = 0;

    }

    get _id(): string | null {
        return (this.id === null) ? null : this.id.$oid;
    }
  
    async updateSubscription(subscription: SubscriptionUpdateTypes) {
        const { modifiedCount } = await this.userdb.updateOne(
            { id: this.id },
            { $set: subscription }
          );
          if(modifiedCount) return subscription;
          return console.log('subscription: 0')
    }
    delete(): Promise < any > {
        throw new Error('Method not implemented.');
    }
}