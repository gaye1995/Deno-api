import { RouteIndex } from "./routes/index.ts";
import { opine, json, urlencoded } from "https://deno.land/x/opine@1.0.2/mod.ts";
import { Request, Response } from "https://deno.land/x/opine@1.0.2/src/types.ts";

// const port: number = 8001;
const app = opine();

const dirname = new URL('.', import.meta.url).pathname;


app.use(json());
app.use(urlencoded());

app.get('/', (req: Request, res: Response)=> {
    res.sendFile(dirname.substring(1) + 'public/index.html');
});

app.use( RouteIndex );

app.get('*', (req: Request, res: Response)=> {
    res.sendFile(dirname.substring(1) + 'public/404.html');
});

// app.listen(port);
// // denon run --allow-net --allow-read --unstable main.ts // OU denon start
// console.log("app running at: http://localhost/:" + port);