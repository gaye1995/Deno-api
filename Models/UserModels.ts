import { UserDB } from '../db/UserDB.ts';
import { roleTypes } from '../types/rolesTypes.ts';
import UserInterfaces from '../interfaces/UserInterfaces.ts';
import { hash } from '../helpers/password.helpers.ts';
import { userUpdateTypes } from '../types/userUpdateTypes.ts';

export class UserModels extends UserDB implements UserInterfaces {

    private _role: roleTypes = "Tuteur";

    email: string;
    password: string;
    lastname: string;
    firstname: string;

    constructor(email: string, password: string, nom: string, prenom: string) {
        super();
        this.email = email;
        this.lastname = nom;
        this.firstname = prenom;
        this.password = password;
    }


    get role():roleTypes{
        return this._role;
    }

    setRole(role: roleTypes): void {
        this._role = role;
        this.update({role: role});

    }

    async insert(): Promise<void> {
        this.password = await hash(this.password)
        this.email = await this.userdb.insertOne({
            role: this._role,
            email: this.email,
            password: this.password,
            lastname: this.lastname,
            firstname: this.firstname,
        });
    }
    async update(update:userUpdateTypes): Promise < any > {
        const { modifiedCount } = await this.userdb.updateOne(
            { _email: this.email },
            { $set: update}
          );
   }
    delete(): Promise < any > {
        throw new Error('Method not implemented.');
    }
}