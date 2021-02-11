import { UserDB } from "../db/UserDB.ts";

    
     
export const incLoginAttempts = (user:any)=> {
    let _userdb: UserDB = new UserDB();
    let userdb = _userdb.userdb;
    const SALT_WORK_FACTOR = 10;
    const MAX_LOGIN_ATTEMPTS = 5;
    const LOCK_TIME = 1 * 60 * 1000;

    userdb.virtual('isLocked').get(()=> {
        // recherche un futur verrou
        return !! (user.lockUntil  &&  user.lockUntil  >  Date.now() ) ;
      });
      console.log(user.lockUntil);
      const { modifiedCount } = user.updateOne(
        {email: user.email},
        {$set: { loginAttempts: 1 }},
        {$unset: { lockUntil: 1 }}
      );
      console.log(user.lockUntil);
      console.log(user.loginAttempts);
    // if we have a previous lock that has expired, restart at 1
    if (user.lockUntil && user.lockUntil < Date.now()) {
      const { modifiedCount } = user.updateOne(
        {email: user.email},
        {$set: { loginAttempts: 1 }},
        //{$unset: { lockUntil: 1 }}
      );
      //console.log(user.lockUntil);
      return modifiedCount;
    }
  
    // otherwise we're incrementing
    let updates = { $inc: { loginAttempts: 1 } };
    // lock the account if we've reached max attempts and it's not locked already
    if(user.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !user.isLocked) {
      updates.$inc.loginAttempts = Date.now() + LOCK_TIME   
  }
  console.log(user);
  return user.update(updates);
}
