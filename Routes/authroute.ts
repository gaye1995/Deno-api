import { Router } from "https://deno.land/x/oak@v5.0.0/mod.ts";
import {UsersControllers} from '../controllers/UsersControllers.ts'
const router = new Router();

router
  
  .post("/login", UsersControllers.login);

  export { router as AuthentificationRoute }