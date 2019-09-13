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

    //TODO: create token
    const token: string = jwt.sign({
        userId: user.id,
        userName: user.name
    }, jwtConfig.secretKey, {
        expiresIn: "1h"
    });

    response.status(201);
    response.header("auth", token);
    response.send({
        "success": true
    });
}
