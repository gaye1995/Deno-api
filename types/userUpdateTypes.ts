import { roleTypes } from './rolesTypes.ts';
import {subscriptionTypes} from './rolesTypes.ts'
import { ChildsModels } from "../Models/ChildsModels.ts";

export type userUpdateTypes = 
{
    password?: string,
    lastname?: string,
    firstname?: string,
    chils? : ChildsModels,

    role?: roleTypes,
}
export type SubscriptionUpdateTypes = 
{
    subscription?: subscriptionTypes,
}