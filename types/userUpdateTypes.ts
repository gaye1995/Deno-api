import { roleTypes } from './rolesTypes.ts';
export type userUpdateTypes = 
{
    password?: string,
    lastname?: string,
    firstname?: string,

    role?: roleTypes,
}
export type SubscriptionUpdateTypes = 
{
    subscription?: boolean,
}