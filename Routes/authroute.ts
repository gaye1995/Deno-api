import { Router } from 'https://deno.land/x/abc@v1.2.4/router.ts';
import { Context } from "https://deno.land/x/abc@v1.2.4/context.ts";
import { HttpMethod } from "https://deno.land/x/abc@v1.2.4/constants.ts";
import { UsersControllers } from '../controllers/UsersControllers.ts';
const router = new Router();
router.add(HttpMethod.Post, '/register', UsersControllers.register);
router.add(HttpMethod.Post, '/login', UsersControllers.login);
router.add(HttpMethod.Post, '/user', UsersControllers.modifuser);
router.add(HttpMethod.Delete, '/user', UsersControllers.modifuser);
//router.add(HttpMethod.Put, '/subscription',UsersControllers.subscription)
router.add(HttpMethod.Post, '/user/child',UsersControllers.userchild)
// router.add(HttpMethod.Delete, '/',auth.middleware,UsersControllers.index)
router.add(HttpMethod.Put, '/user',UsersControllers.)
router.add(HttpMethod.Delete, '/user/off',UsersControllers.logout)
router.add(HttpMethod.Delete, '/user/child',UsersControllers.deleteUserChild)
router.add(HttpMethod.Get, '/user/child',UsersControllers.allUserChild)
/*import { Router } from "https://deno.land/x/oak/mod.ts";
import {UsersControllers} from '../controllers/UsersControllers.ts';



router.post("/login",UsersControllers.login);
*/
  export { router }