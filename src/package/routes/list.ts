import { Express } from "express";
import * as func from "./function";

export function registerRoute(app: Express) {
    app.post("/register", (request, response) => {
        func.register(request, response);
    });

    app.post("/login", (request, response) => {
        func.login(request, response);
    });

    app.post("/authenticate", (request, response) => {
        //TODO: authenticate
    });
}
