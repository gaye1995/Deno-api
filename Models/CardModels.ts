import { UserDB } from './../db/UserDB.ts';
import type { roleTypes, subscriptionTypes } from '../types/rolesTypes.ts';
import { hash } from '../middlewares/auth.middleware.ts';
import cardInterfaces from '../interfaces/CardInterfaces.ts';
import { Bson } from "https://deno.land/x/bson/mod.ts";
import type { SubscriptionUpdateTypes, userUpdateTypes } from '../types/userUpdateTypes.ts';
import { ObjectId } from "https://deno.land/x/mongo@v0.20.1/src/utils/bson.ts";
import { BSONRegExp } from "https://deno.land/x/mongo@v0.20.1/bson/bson.d.ts";

export class cardModels extends UserDB implements cardInterfaces {

    cartNumber: string;
    month: Date;
    year: Date;
    Default: string;
    idUsers : string;
    createdAt: Date;
    updatedAt : Date;

    constructor(cartNumber: string, month: Date, year: Date, Default: string, idUsers : string ) {
        super();
        this.cartNumber = cartNumber;
        this.month = month;
        this.year = year;
        this.Default = Default;
        this.idUsers = idUsers;
        this.createdAt = new Date();
        this.updatedAt = new Date();

       }
       async insert(): Promise < void > {
        const insertcard = await this.userdb.insertOne({
            cardNumber: this.cartNumber,
            month: this.month,
            year: this.year,
            default: this.Default ,
            idUsers: this.idUsers ,
            createdAt : this.createdAt,
            updatedAt : this.updatedAt,
        });
    }

   
}
