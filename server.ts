import * as expressive from 'https://raw.githubusercontent.com/NMathar/deno-express/master/mod.ts';
import { Router } from "https://deno.land/x/oak@v5.0.0/router.ts";
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