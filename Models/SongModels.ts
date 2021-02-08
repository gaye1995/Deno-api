import { UserDB } from './../db/UserDB.ts';
import type { roleTypes, subscriptionTypes } from '../types/rolesTypes.ts';
import { hash } from '../middlewares/auth.middleware.ts';
import SongInterfaces from '../interfaces/SongInterfaces.ts';
import { Bson } from "https://deno.land/x/bson/mod.ts";
import type { SubscriptionUpdateTypes, userUpdateTypes } from '../types/userUpdateTypes.ts';
import { ObjectId } from "https://deno.land/x/mongo@v0.20.1/src/utils/bson.ts";
import { BSONRegExp } from "https://deno.land/x/mongo@v0.20.1/bson/bson.d.ts";

export class SongModels extends UserDB implements SongInterfaces {

    id :{ $oid: string }|null = null;
    name: string;
    url: string;
    cover: string;
    type: string;
    createdAt: Date;
    updatedAt : Date;

    constructor(name: string, url: string, type: string, cover: string) {
        super();
        this.name = name;
        this.url = url;
        this.cover = cover;
        this.type = type;
        this.createdAt = new Date();
        this.updatedAt = new Date();

    }
    get _id():string|null{
        return (this.id === null)?null: this.id.$oid;
    }

   
}
