import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRepository";

interface IPayload {
    sub: string;
}

export async function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new Error("Token missing");
    }

    const [, token] = authHeader.split(" ");

    try {
        const { sub: userId } = verify(
            token,
            "638964171e49c1d5ab1f31fe1e469ef4"
        ) as IPayload;

        const usersRepository = new UsersRepository();
        const user = usersRepository.findById(userId);

        if (!user) {
            throw new Error("User doesn't exists");
        }

        next();
    } catch (error) {
        throw new Error("Invalid token!");
    }
}
