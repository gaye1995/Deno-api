import { hash } from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

export default class PasswordException extends Error {

    private static SALT_ROUNDS: number = 10;
    private static MIN_PASS_SIZE: number = 7;

    constructor() {
        super('Password is not valid')
    }

    public static isValidPassword(password: string): boolean {
        const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,20}$/
        return (!reg.test(password))

    }

    public static async hashPassword(password: string): Promise < string > {
        return await hash(password)
    }


}
