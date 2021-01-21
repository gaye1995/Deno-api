import { Application } from 'https://deno.land/x/abc@v1.2.4/mod.ts';
import { router } from './Routes/authroute.ts';
import { UserModels } from "./Models/UserModels.ts";
import { UsersControllers } from './controllers/UsersControllers.ts';
import {TokenMidd} from './middlewares/auth.middleware.ts'
const app = new Application();
app.use(TokenMidd);
const port = 8000;
// app.use(router.routes());
app.router = router;
//app.get('/user',()=>{
 //   console.log('moi meme');
  //});
// deno run --allow-net --allow-read --unstable server.ts
app.start({ port });
console.log('app listening on port ' + port);

