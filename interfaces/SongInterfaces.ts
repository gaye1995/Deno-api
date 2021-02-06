import { roleTypes } from '../types/rolesTypes.ts';
import { userUpdateTypes } from '../types/userUpdateTypes.ts';
import { Bson } from "https://deno.land/x/bson/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.20.1/src/utils/bson.ts";

export default interface SongInterfaces {
    id :{ $oid: string }|null;
    name: string;
    url: string;
    cover: string;
    type: string;
    createdAt: Date;
    updatedAt : Date;
    
}
