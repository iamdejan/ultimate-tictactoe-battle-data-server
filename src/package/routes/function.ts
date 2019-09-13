import {Request, Response} from "express";
import {User} from "../../entity/User";
import {getRepository} from "typeorm";
import * as jwt from "jsonwebtoken";
import jwtConfig from "../config/jwtConfig";

export async function register(request: Request, response: Response) {
    let user: User = new User();
    user.id = Number.parseInt(request.body.id, 10);
    user.name = request.body.name;
    user.password = request.body.password;
    user.hashPassword();

    const userRepository = getRepository(User);
    await userRepository.save(user);

    const token: string = jwt.sign({
        userId: user.id,
        userName: user.name
    }, jwtConfig.secretKey, {
        expiresIn: "1h"
    });

    response.status(201);
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

    const token: string = jwt.sign({
        userId: user.id,
        userName: user.name
    }, jwtConfig.secretKey, {
        expiresIn: "1h"
    });

    response.status(201);
    response.header("Authentication", token);
    response.json({
        "success": true
    });
}
