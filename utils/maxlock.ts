import { UserDB } from "../db/UserDB.ts";

    
     
export const incLoginAttempts = async(user:any,loginAttempts:any)=> {
    let _userdb: UserDB = new UserDB();
    let userdb = _userdb.userdb;
  
    const lock = setInterval(() => {(user.email);}, 120000);
    if( lock <=5 ){
        await userdb.updateOne(
            { email: user.email },
            {$set: {loginAttempts: (loginAttempts + 1) }}); 
    }
    console.log(lock);
    clearInterval(lock);
    return loginAttempts;
}
