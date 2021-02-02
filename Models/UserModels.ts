import { UserDB } from './../db/UserDB.ts';
import type { roleTypes } from '../types/rolesTypes.ts';
import { hash } from '../helpers/password.helpers.ts';
import UserInterfaces from '../interfaces/UserInterfaces.ts';
import type { SubscriptionUpdateTypes, userUpdateTypes } from '../types/userUpdateTypes.ts';

export class UserModels extends UserDB implements UserInterfaces {

    private _role: roleTypes = "Tuteur";
    email: string;
    password: string;
    lastname: string;
    firstname: string;
    dateNaissance: Date;
    sexe: string;
    access_token:string;
    refresh_token:String;
    phoneNumber ? : string;
    subscription: number ;

    constructor(email: string, password: string, nom: string, prenom: string, tel: string, dateNaiss: string,sexe:string) {
        super();
        this.email = email;
        this.password = password;
        this.lastname = nom;
        this.firstname = prenom;
        this.dateNaissance = new Date(dateNaiss);
        this.sexe = sexe;
        this.phoneNumber = tel;
        this.subscription = 0;
        this.access_token='';
        this.refresh_token='';

    }

    

    get role(): roleTypes {
        return this._role;
    }

    setRole(role: roleTypes): void {
        this._role = role;
        this.update({ role: role });
    }
    getAge(): Number {
        var ageDifMs = Date.now() - this.dateNaissance.getTime();
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
            email: this.email,
            password: this.password,
            lastname: this.lastname,
            firstname: this.firstname,
            dateNaiss: this.dateNaissance,
            sexe: this.sexe,
            phoneNumber: this.phoneNumber,
            subscription: this.subscription ,

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