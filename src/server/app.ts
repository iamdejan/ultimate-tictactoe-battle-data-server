import bodyParser from "body-parser";
import express from "express";
import { registerRoute } from "../package/routes/list";
import helmet from "helmet";
import cors from "cors";
import {createConnection} from "typeorm";

const app = express();
const port = 3000;

createConnection().then(async connection => {
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    registerRoute(app);

    app.listen(port, (error) => {
        if(error) {
            return console.error(error);
        }

        return console.log("Server is listening at port", 3000);
    });
}).catch(error => console.error(error));
