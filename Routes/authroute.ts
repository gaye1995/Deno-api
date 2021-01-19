import { Router } from 'https://deno.land/x/abc@v1.2.4/router.ts';
import { Context } from "https://deno.land/x/abc@v1.2.4/context.ts";
import { HttpMethod } from "https://deno.land/x/abc@v1.2.4/constants.ts";
import { UsersControllers } from '../controllers/UsersControllers.ts';


const router = new Router();
router.add(HttpMethod.Post, '/register', UsersControllers.register);
router.add('post', '/login', UsersControllers.login);
router.add('put', '/user', UsersControllers.modifuser);
router.add(HttpMethod.Get, '/user',(c:Context)=>{
  c.response.body = 'b';
  console.log('moi meme');
});

/*import { Router } from "https://deno.land/x/oak/mod.ts";
import {UsersControllers} from '../controllers/UsersControllers.ts';

const router = new Router();

router.post("/login",UsersControllers.login);
*/
  export { router }