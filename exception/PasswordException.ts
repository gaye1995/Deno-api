import { hash } from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

export default class PasswordException extends Error {

    private static SALT_ROUNDS: number = 10;
    private static MIN_PASS_SIZE: number = 6;

    constructor() {
        super('Password is not valid')
    }

    public static isValidPassword(password: string): boolean {
        return password.length >= this.MIN_PASS_SIZE;
    }

    public static async hashPassword(password: string): Promise < string > {
        return await hash(password)
    }


}
