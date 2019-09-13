import {Request, Response} from "express";
import {User} from "../../entity/User";
import {getRepository} from "typeorm";

export async function register(request: Request, response: Response) {
    let user: User = new User();
    user.id = Number.parseInt(request.body.id, 10);
    user.name = request.body.name;
    user.password = request.body.password;
    user.hashPassword();

    const userRepository = getRepository(User);
    await userRepository.save(user);

    response.header(200);
    response.send();
}
