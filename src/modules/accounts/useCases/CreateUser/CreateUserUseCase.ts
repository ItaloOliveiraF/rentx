import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
    name: string;
    email: string;
    password: string;
    driver_license: string; //
}

@injectable()
class CreateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}

    async execute({
        name,
        email,
        password,
        driver_license,
    }: IRequest): Promise<void> {
        const userAlreadyExists = this.usersRepository.findByEmail(email);

        if (userAlreadyExists) {
            throw new Error("User already exists.");
        }

        const encryptPassword = await hash(password, 8);

        await this.usersRepository.create({
            name,
            email,
            password: encryptPassword,
            driver_license,
        });
    }
}

export { CreateUserUseCase };
