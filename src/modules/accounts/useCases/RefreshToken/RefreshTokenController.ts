import { Request, Response } from "express";
import { container } from "tsyringe";

import { RefreshTokenUseCase } from "./RefreshTokenUseCase";

class RefreshTokenController {
    async handle(request: Request, response: Response): Promise<Response> {
        const refresh_token =
            request.body.refresh_token ||
            request.headers["x-acess-token"] ||
            request.query.refresh_token;

        const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);

        const userTokens = await refreshTokenUseCase.execute(refresh_token);

        return response.json(userTokens);
    }
}

export { RefreshTokenController };
