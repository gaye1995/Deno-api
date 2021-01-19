import { UserDB } from './../db/UserDB.ts';
import type { roleTypes } from '../types/rolesTypes.ts';
import { hash } from '../helpers/password.helpers.ts';
import UserInterfaces from '../interfaces/UserInterfaces.ts';
import type { SubscriptionUpdateTypes } from '../types/userUpdateTypes.ts';

export class SubscriptionModels extends UserDB {

    private id: { $oid: string } | null = null;

    subscription: boolean ;

    constructor(subscription: boolean) {
        super();
        this.subscription = subscription;

    }

    get _id(): string | null {
        return (this.id === null) ? null : this.id.$oid;
    }
  
    async updateSubscription(subscription: SubscriptionUpdateTypes) {
        const { modifiedCount } = await this.userdb.updateOne(
            { id: this.id },
            { $set: subscription }
          );
    }
    delete(): Promise < any > {
        throw new Error('Method not implemented.');
    }
}