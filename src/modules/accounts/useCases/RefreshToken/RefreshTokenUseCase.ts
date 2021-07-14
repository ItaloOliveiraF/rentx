import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
    sub: string;
    email: string;
}

interface ITokenResponse {
    refresh_token: string;
    auth_token: string;
}

@injectable()
class RefreshTokenUseCase {
    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) {}

    async execute(token: string): Promise<ITokenResponse> {
        const { sub: user_id, email } = verify(
            token,
            auth.secret_refresh_token
        ) as IPayload;

        const userToken = await this.usersTokensRepository.findByUserAndRefreshToken(
            user_id,
            token
        );

        if (!userToken) {
            throw new AppError("User Token does not exists!");
        }

        await this.usersTokensRepository.deleteById(userToken.id);

        const refresh_token = sign({ email }, auth.secret_refresh_token, {
            subject: user_id,
            expiresIn: auth.expires_in_refresh_token,
        });

        const expires_date = this.dateProvider.addDays(
            this.dateProvider.dateNow(),
            auth.expires_refresh_token_days
        );

        await this.usersTokensRepository.create({
            user_id,
            expires_date,
            refresh_token,
        });

        const auth_token = sign({ email }, auth.secret_token, {
            subject: user_id,
            expiresIn: auth.expires_in_token,
        });

        return { refresh_token, auth_token };
    }
}

export { RefreshTokenUseCase };
