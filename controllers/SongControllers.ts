import { play } from "https://deno.land/x/audio@0.1.0/mod.ts";
import { HandlerFunc } from 'https://deno.land/x/abc@v1.2.4/types.ts';
import { Context } from 'https://deno.land/x/abc@v1.2.4/context.ts';
import { UserDB } from './../db/UserDB.ts';
import * as jwt from '../middlewares/jwt-middleware.ts';
import { Bson } from "https://deno.land/x/bson/mod.ts";
import { SongModels } from '../Models/SongModels.ts';
import PasswordException from '../exception/PasswordException.ts';
import EmailException from '../exception/EmailException.ts';
import {getToken} from '../middlewares/jwt-middleware.ts'
import { getJwtPayload } from "../middlewares/jwt-middleware.ts";
import {mailRegister} from '../helpers/mails.ts'
export class SongControllers {

    /*static addsong: HandlerFunc = async(c: Context) => {
        function loadPlayer(elt) {
            alert($(elt).find('audio').attr('src'));
        }
        const song = new SongModels(
            new Bson.ObjectId,
            'ryhanna',
            'music.mp3',
            'me',
            'only girl',
            );
    }*/
    static songs: HandlerFunc = async(c: Context) => {
        let _userdb: UserDB = new UserDB();
        let userdb = _userdb.userdb;
        try {
            const authorization: any = c.request.headers.get("authorization");
            if(!authorization && await getToken(authorization))
            {
                c.json({status: 401, error: true, message: "Votre token n'est pas correct" });             
            }else{
                const token = await getToken(authorization);
                const dataparent = await getJwtPayload(token);
                const userParent: any = await userdb.findOne({ email: dataparent.email });
                if(userParent.subscription===0)
                {
                      c.json({status: 403,error: true, message: "Votre abonnement ne permet pas d'accéder à la ressource" });
                }else{
                     /**
                     * @description Get all songs
                     * @route GET /songs
                     */
                    c.json([{status: 200, error: false, songs:[] }])
                }
            }
    }catch{
        c.json({status: 401, error: true, message: "Votre token n'est pas correct" });             
    }
}
static songsid: HandlerFunc = async(c: Context) => {
    let _userdb: UserDB = new UserDB();
    let userdb = _userdb.userdb;
    try {
        const authorization: any = c.request.headers.get("authorization");
        if(!authorization && await getToken(authorization))
        {
            c.json({status: 401, error: true, message: "Votre token n'est pas correct" });             
        }else{
            const token = await getToken(authorization);
            const dataparent = await getJwtPayload(token);
            const userParent: any = await userdb.findOne({ email: dataparent.email });
            if(userParent.subscription===0)
            {
                  c.json({status: 403,error: true, message: "Votre abonnement ne permet pas d'accéder à la ressource" });
            }else{
                const songs = userdb.findOne({id: c.params})
                // await play('/songs/{id}');
                return c.json({ error: false, songs});
            }
        }
}catch{
    c.json({status: 401, error: true, message: "Votre token n'est pas correct" });             
}
}
}