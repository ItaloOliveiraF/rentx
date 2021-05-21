import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateCarSpecificationUseCase } from "./createCarSpecificationUseCase";

class CreateCarSpecificationController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { car_id } = request.params;
        const { specifications_ids } = request.body;

        const createCarSpecificationUseCase = container.resolve(
            CreateCarSpecificationUseCase
        );

        await createCarSpecificationUseCase.execute({
            car_id,
            specifications_ids,
        });

        return response.status(201).send();
    }
}

export { CreateCarSpecificationController };
