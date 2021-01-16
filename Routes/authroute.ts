import { Router } from 'https://deno.land/x/abc@v1.2.4/router.ts';
import { UsersControllers } from '../controllers/UsersControllers.ts';


const router = new Router();

router.add('get', '/', UsersControllers.test);
router.add('post', '/login', UsersControllers.login);

/*import { Router } from "https://deno.land/x/oak/mod.ts";
import {UsersControllers} from '../controllers/UsersControllers.ts';

const router = new Router();

router.post("/login",UsersControllers.login);
*/
  export { router }