import { Router } from "https://deno.land/x/oak/mod.ts";
import {UsersControllers} from '../controllers/UsersControllers.ts';

const router = new Router();

router.post("/login",UsersControllers.login);

  export { router }