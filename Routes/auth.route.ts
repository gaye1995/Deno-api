import { Router } from "https://deno.land/x/oak/mod.ts";
import {  postLogin, postRegister  } from "../controllers/UsersController.ts";


const router = new Router();

router
  
  .post("/login", postLogin)
  .post("/register", postRegister)

