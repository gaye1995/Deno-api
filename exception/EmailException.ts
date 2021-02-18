export default class EmailException extends Error {
    private static SALT_ROUNDS: number = 10;
    private static MIN_PASS_SIZE: number = 7;

    constructor() {
        super('Email is not valid')
    }

    static checkEmail(email: string): boolean {
        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return (!reg.test(email.toLowerCase().trim()))
    }
    static ischeckEmail(email: string):boolean {
        return email.length > this.SALT_ROUNDS
    }
}