import { Application,Router,Request ,Response} from "https://deno.land/x/oak/mod.ts";
import DateException from '../exception/DateException.ts';
import EmailException from '../exception/EmailException.ts';
import PasswordException from '../exception/PasswordException.ts';

const split = (token: string) => { return token.split('Bearer ').join('') }


export const loginMidd = (req: Request, res: Response, next: () => void) => {

    let data: any = req.body;

    const champsRequire = [`email`, `password`]

    try {

        let error: boolean = true;
        let textError: string = '';
        for (const require in champsRequire) {
            error = true;
            for (const champs in data) {
                if (champs === champsRequire[require])
                    error = false;
            }
            if (error)
                textError += `${champsRequire[require]}, `
        }
        if (textError.length > 0) {
            textError = textError.slice(0, -2); // Delete ', '
            throw new Error(`Les champs ${textError} sont manquant!`)
        }

        if (EmailException.checkEmail(data.email)) // Check valid syntaxe email
            throw new EmailException();
      
        next()

    } catch (err) {
        return 'Response.status(401).json({ error: true, message: err.message }).end()';
    }
}