import { Application } from 'https://deno.land/x/abc@v1.2.4/mod.ts';
import { router } from './Routes/authroute.ts';
import { UserModels } from "./Models/UserModels.ts";
import { UsersControllers } from './controllers/UsersControllers.ts';

const app = new Application();

const port = 8000;
// app.use(router.routes());
app.router = router;
//app.get('/user',()=>{
 //   console.log('moi meme');
  //});
// deno run --allow-net --allow-read --unstable server.ts
app.start({ port });
console.log('app listening on port ' + port);
/*
import * as expressive from 'https://raw.githubusercontent.com/NMathar/deno-express/master/mod.ts';
import {router} from './Routes/authroute.ts'
import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();


const port = 8001;
// route with dynamic parameter

app.use(router.routes());


(async() => {
    const server = await app.listen({port});
    // deno run server.ts --allow-net --allow-read --unstable --isolatedModules
    console.log("app listening on port " + server+port);
})();
*/