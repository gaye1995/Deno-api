import { UserDB } from './../db/UserDB.ts';
import type { roleTypes, subscriptionTypes } from '../types/rolesTypes.ts';
import { hash } from '../middlewares/auth.middleware.ts';
import UserInterfaces from '../interfaces/UserInterfaces.ts';
import { Bson } from "https://deno.land/x/bson/mod.ts";
import type { SubscriptionUpdateTypes, userUpdateTypes } from '../types/userUpdateTypes.ts';
import { ObjectId } from "https://deno.land/x/mongo@v0.20.1/src/utils/bson.ts";

export class UserModels extends UserDB implements UserInterfaces {

    private _role: roleTypes = "Tuteur";
    private id :{ $oid: string }|null = null;
    firstname: string;
    lastname: string;
    email: string;
    sexe: string;
    password: string;
    dateNaissance: Date;
    access_token:string;
    refresh_token:string;
    phoneNumber ? : string;
    subscription?:subscriptionTypes = 0;
    idparent:  Bson.ObjectId ;
    constructor(prenom: string, nom: string, email: string,sexe:string, password: string,  dateNaissance: string) {
        super();
        this.firstname = prenom;
        this.lastname = nom;
        this.email = email;
        this.sexe = sexe;
        this.password = password;
        this.dateNaissance = new Date(dateNaissance);
        this.access_token  = '';
        this.refresh_token = '';
        this.idparent = new Bson.ObjectId(this.id);

    }

    
    get _id():string|null{
        return (this.id === null)?null: this.id.$oid;
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
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            sexe: this.sexe,
            password: this.password,
            dateNaissance: this.dateNaissance,
            phoneNumber: this.phoneNumber,
            subscription: this.subscription ,
            access_token: this.access_token ,
            refresh_token: this.refresh_token ,
            idparent :  this.idparent,

        });
    }
    async update(update: userUpdateTypes) {
        const { modifiedCount } = await this.userdb.updateOne(
            { email: this.email },
            { $set: update }
          );
    }
    async updateSubscription() {
        const { modifiedCount } = await this.userdb.updateOne(
            { email: this.email },
            { $set: {subscription: 1} }
          );
    }
    delete(): Promise < any > {
        throw new Error('Method not implemented.');
    }
    async updatechild(parent: Bson.ObjectId): Promise < any > {
        const { modifiedCount } = await this.userdb.updateOne(
            { email: this.userdb.email },
            { $set: {idparent : parent} }
          ); 
       }
}
