import { Router } from 'https://deno.land/x/abc@v1.2.4/router.ts';
import { UsersControllers } from '../controllers/UsersControllers.ts';


const router = new Router();
router.add('post', '/register', UsersControllers.register);
router.add('post', '/login', UsersControllers.login);
router.add('put', '/user', UsersControllers.modifuser);
router.add('delete', '/user/delete', UsersControllers.deleteUserChild);
/*import { Router } from "https://deno.land/x/oak/mod.ts";
import {UsersControllers} from '../controllers/UsersControllers.ts';

const router = new Router();

router.post("/login",UsersControllers.login);
*/
  export { router }