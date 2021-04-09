import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    token: string;
    user: {
        name: string;
        email: string;
    };
}

@injectable()
class AuthenticateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}
    async execute({ email, password }: IRequest): Promise<IResponse> {
        // Verifica se o usuário existe
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new Error("Email or password incorrect!");
        }

        const correctPassword = await compare(password, user.password);

        if (!correctPassword) {
            throw new Error("Email or password incorrect!");
        }

        const token = sign({}, "638964171e49c1d5ab1f31fe1e469ef4", {
            subject: user.id,
            expiresIn: "1d",
        });

        return {
            token,
            user: {
                name: user.name,
                email: user.email,
            },
        };
    }
}

export { AuthenticateUserUseCase };
