import { UserDB } from './../db/UserDB.ts';
import type { roleTypes, subscriptionTypes } from '../types/rolesTypes.ts';
import { hash } from '../helpers/password.helpers.ts';
import UserInterfaces from '../interfaces/UserInterfaces.ts';
import ChildsInterfaces from '../interfaces/ChildsInterfaces.ts';

import type { SubscriptionUpdateTypes, userUpdateTypes } from '../types/userUpdateTypes.ts';
import { ChildsModels } from "./ChildsModels.ts";

export class UserModels extends UserDB implements UserInterfaces {

    private _role: roleTypes = "Tuteur";
    firstname: string;
    lastname: string;
    email: string;
    sexe: string;
    password: string;
    dateNaiss: Date;
    phoneNumber ? : string;
    subscription?:subscriptionTypes = 0;
    nb_enfants? = 0;
    childs?: ChildsInterfaces;

    constructor(prenom: string, nom: string, email: string,sexe:string, password: string,  dateNaiss: string,childs: ChildsModels) {
        super();
        this.firstname = prenom;
        this.lastname = nom;
        this.email = email;
        this.sexe = sexe;
        this.password = password;
        this.dateNaiss = new Date(dateNaiss);
        this.childs= new ChildsModels(
            childs.firstname,
            childs.lastname,
            childs.email,
            childs.sexe,
            childs.password,
            Date(),
        );

    }

    

    get role(): roleTypes {
        return this._role;
    }

    setRole(role: roleTypes): void {
        this._role = role;
        this.update({ role: role });
    }
    getAge(): Number {
        var ageDifMs = Date.now() - this.dateNaiss.getTime();
        var ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    fullName(): string {
        return `${this.lastname} ${this.firstname}`;
    }
    async insert(): Promise < void > {
        this.password = await hash(this.password);
        this.email = await this.userdb.insertOne({
            role: this._role,
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            sexe: this.sexe,
            password: this.password,
            dateNaiss: this.dateNaiss,
            phoneNumber: this.phoneNumber,
            subscription: this.subscription ,
            nb_enfants: this.nb_enfants,
            childs: this.childs,

        });
    }
    async update(update: userUpdateTypes) {
        const { modifiedCount } = await this.userdb.updateOne(
            { email: this.email },
            { $set: update }
          );
    }
    async updateSubscription(subscription:SubscriptionUpdateTypes) {
        const { modifiedCount } = await this.userdb.updateOne(
            { email: this.email },
            { $set: {subscription: 1} }
          );
          if(modifiedCount) return subscription;
          return false;
    }
    delete(): Promise < any > {
        throw new Error('Method not implemented.');
    }
}