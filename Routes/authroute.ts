import { Router } from 'https://deno.land/x/abc@v1.2.4/router.ts';
import { Context } from "https://deno.land/x/abc@v1.2.4/context.ts";
import { HttpMethod } from "https://deno.land/x/abc@v1.2.4/constants.ts";
import { UsersControllers } from '../controllers/UsersControllers.ts';
import {StripeControllers} from '../controllers/StripeControllers.ts';
import { CartControllers } from '../controllers/CartControllers.ts';
import {SongControllers} from '../controllers/SongControllers.ts';

const router = new Router();
router.add(HttpMethod.Get, '/', UsersControllers.index);
router.add(HttpMethod.Post, '/register', UsersControllers.register);
router.add(HttpMethod.Post, '/login', UsersControllers.login);
router.add(HttpMethod.Put, '/subscription',StripeControllers.subsstripe)
router.add(HttpMethod.Post, '/user/child',UsersControllers.userchild)
router.add(HttpMethod.Post, '/user/cart',CartControllers.usercart)
router.add(HttpMethod.Get, '/songs',SongControllers.songs)
router.add(HttpMethod.Get, '/songs/{id}',SongControllers.songsid)
router.add(HttpMethod.Get, '/user/child',UsersControllers.allUserChild)
router.add(HttpMethod.Get, '/biils',UsersControllers.facture)
router.add(HttpMethod.Delete, '/user', UsersControllers.deleteuser);
router.add(HttpMethod.Delete, '/user/child',UsersControllers.deleteuserchild)
router.add(HttpMethod.Delete, '/user/off',UsersControllers.offuser)
router.add(HttpMethod.Put, '/user/',UsersControllers.updateUser)


//router.add(HttpMethod.Get, '/user/{id}', SongControllers.song);

  export { router }