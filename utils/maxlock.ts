import { UserDB } from "../db/UserDB.ts";

    
     
export const incLoginAttempts = (user:any)=> {
    let _userdb: UserDB = new UserDB();
    let userdb = _userdb.userdb;
    const SALT_WORK_FACTOR = 10;
    const MAX_LOGIN_ATTEMPTS = 5;
    const LOCK_TIME = 1 * 60 * 1000;
    userdb.virtual('isLocked').get(()=> {
        // recherche un futur verrou
        return !! ( user.lockUntil  &&  user.lockUntil  >  Date . now ( ) ) ;
      } ) ;
    // if we have a previous lock that has expired, restart at 1
    if (user.lockUntil && user.lockUntil < Date.now()) {
      return user.update({
        $set: { loginAttempts: 1 },
        $unset: { lockUntil: 1 }
      });
    }
  
    // otherwise we're incrementing
    let updates = { $inc: { loginAttempts: 1 } };
    // lock the account if we've reached max attempts and it's not locked already
    if(user.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !user.isLocked) {
        const { modifiedCount } = userdb.updateOne(
            { user: userdb.email },
            { $set: { lockUntil: Date.now() + LOCK_TIME  }});

    return user.update(updates);
  }
}
