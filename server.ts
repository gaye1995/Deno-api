import { Application } from 'https://deno.land/x/abc@v1.2.4/mod.ts';
// import { Router } from 'https://deno.land/x/oak@v5.0.0/router.ts';
import { router } from './Routes/authroute.ts';
import { UserModels } from "./Models/UserModels.ts";

const app = new Application();

const port = 8000;
// route with dynamic parameter
let user = new UserModels('joijoi','joijoi','joijoi','joijoi','joijoi',"1993-11-22")
user.insert();
console.log(user);
// app.use(router.routes());
app.router = router;
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