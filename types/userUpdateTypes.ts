import { roleTypes } from './rolesTypes.ts';
import {subscriptionTypes} from './rolesTypes.ts'
import { Bson } from "https://deno.land/x/bson/mod.ts";
export type userUpdateTypes = 
{
    password?: string,
    lastname?: string,
    firstname?: string,
    idparent? : Bson.ObjectId,

    role?: roleTypes,
}
export type SubscriptionUpdateTypes = 
{
    subscription?: subscriptionTypes,
}