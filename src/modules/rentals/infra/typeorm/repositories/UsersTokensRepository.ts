import { getRepository, Repository } from "typeorm";

import { ICreateUserTokenDTO } from "@modules/rentals/dtos/ICreateUserTokenDTO";
import { IUsersTokensRepository } from "@modules/rentals/repositories/IUsersTokensRepository";

import { UserToken } from "../entities/UserToken";

class UsersTokensRepository implements IUsersTokensRepository {
    private repository: Repository<UserToken>;

    constructor() {
        this.repository = getRepository(UserToken);
    }

    async create({
        user_id,
        refresh_token,
        expires_date,
    }: ICreateUserTokenDTO): Promise<UserToken> {
        const userToken = this.repository.create({
            user_id,
            refresh_token,
            expires_date,
        });

        await this.repository.save(userToken);

        return userToken;
    }
}

export { UsersTokensRepository };
