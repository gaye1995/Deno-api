import { roleTypes } from './rolesTypes.ts';
import {subscriptionTypes} from './rolesTypes.ts'
export type userUpdateTypes = 
{
    password?: string,
    lastname?: string,
    firstname?: string,

    role?: roleTypes,
}
export type SubscriptionUpdateTypes = 
{
    subscription?: subscriptionTypes,
}