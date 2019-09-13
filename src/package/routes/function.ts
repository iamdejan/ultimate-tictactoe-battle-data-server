import {Request, Response} from "express";
import {User} from "../../entity/User";
import {getRepository} from "typeorm";
import * as jwt from "jsonwebtoken";
import jwtConfig from "../config/jwtConfig";

export async function register(request: Request, response: Response) {
    try {
        let user: User = new User();
        user.id = Number.parseInt(request.body.id, 10);
        user.name = request.body.name;
        user.password = request.body.password;
        user.hashPassword();

        const userRepository = getRepository(User);
        await userRepository.save(user);

        assembleJWT(user, response, 201);
    } catch (error) {
        console.log(error);
        response.status(500).send();
    }
}

function assembleJWT(user: User, response: Response, statusCode: number) {
    const token: string = jwt.sign({
        userId: user.id,
        userName: user.name
    }, jwtConfig.secretKey, {
        expiresIn: "1h"
    });

    response.status(statusCode);
    response.header("Authentication", token);
    response.json({
        "success": true
    });
}

export async function login(request: Request, response: Response) {
    const username = request.body.username;
    const unencryptedPassword = request.body.password;

    const userRepository = getRepository(User);

    let user: User;
    try {
        user = await userRepository.findOneOrFail({
            where: {
                name: username
            }
        });
    } catch (error) {
        console.log(error);
        response.status(404).send();
        return;
    }

    if(user.checkIfUnencryptedPasswordIsValid(unencryptedPassword) != true) {
        response.status(401).send();
        return;
    }

    assembleJWT(user, response, 200);
}

export async function authenticateJWT(request: Request, response: Response) {
    const token = <string>request.headers["authentication"];
    let jwtPayload;
    try {
        jwtPayload = <any>jwt.verify(token, jwtConfig.secretKey);
        response.locals.jwtPayload = jwtPayload;
    } catch (error) {
        console.log(error);
        response.status(401).send();
        return;
    }

    console.log(jwtPayload);

    const user: User = new User();
    user.id = Number.parseInt(jwtPayload.userId, 10);
    user.name = jwtPayload.userName;
    assembleJWT(user, response, 200);
}
