import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "@modules/accounts/useCases/CreateUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";

import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

describe("Authentication user", () => {
    let authenticateUserUseCase: AuthenticateUserUseCase;
    let usersRepository: UsersRepositoryInMemory;
    let createUserUseCase: CreateUserUseCase;

    beforeEach(() => {
        usersRepository = new UsersRepositoryInMemory();
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
        createUserUseCase = new CreateUserUseCase(usersRepository);
    });

    it("should be able to authenticate a user", async () => {
        const user: ICreateUserDTO = {
            name: "User",
            email: "user@test.com",
            password: "1234",
            driver_license: "122456",
        };

        await createUserUseCase.execute(user);

        const authenticationInfos = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });

        expect(authenticationInfos).toHaveProperty("token");
    });

    it("should not be able to authenticate a non-existent user", () => {
        expect(async () => {
            const user = {
                name: "User",
                email: "user@test.com",
                password: "1234",
                driver_license: "122456",
            };

            await authenticateUserUseCase.execute({
                email: user.email,
                password: user.password,
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to authenticate with incorrect password", () => {
        expect(async () => {
            const user = {
                name: "User",
                email: "user@test.com",
                password: "1234",
                driver_license: "122456",
            };

            await createUserUseCase.execute({
                name: user.name,
                email: user.email,
                password: user.password,
                driver_license: user.driver_license,
            });

            await authenticateUserUseCase.execute({
                email: user.email,
                password: "wrong password",
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});
