import { UserDB } from './../db/UserDB.ts';
import type { roleTypes } from '../types/rolesTypes.ts';
import { hash } from '../helpers/password.helpers.ts';
import UserInterfaces from '../interfaces/UserInterfaces.ts';
import ChildsInterfaces from '../interfaces/ChildsInterfaces.ts';

import type { SubscriptionUpdateTypes, userUpdateTypes } from '../types/userUpdateTypes.ts';

export class ChildsModels extends UserDB implements ChildsInterfaces {

    private _role: roleTypes = "Enfant";
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    dateNaiss: Date;
    sexe: string;
    phoneNumber ? : string;
    subscription ?= 1;
    nb_enfants ?= 0;
    childs?: ChildsModels ;

    constructor(prenom: string, nom: string, email: string, password: string, dateNaiss: string, sexe:string) {
        super();
        this.firstname = prenom;
        this.lastname = nom;
        this.email = email;
        this.password = password;
        this.dateNaiss = new Date(dateNaiss);
        this.sexe = sexe;

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
            password: this.password,
            dateNaiss: this.dateNaiss,
            sexe: this.sexe,
            phoneNumber: this.phoneNumber,
            subscription: this.subscription ,
            nb_enfants: this.nb_enfants

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
          return console.log('subscription: 0')
    }
    delete(): Promise < any > {
        throw new Error('Method not implemented.');
    }
}