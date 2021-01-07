import { Router } from "https://deno.land/x/oak/mod.ts";
import {UsersControllers} from '../controllers/UsersControllers.ts';

const router = new Router();

router.post("/login", async(ctx) => {
 UsersControllers.login
});

  export { router }