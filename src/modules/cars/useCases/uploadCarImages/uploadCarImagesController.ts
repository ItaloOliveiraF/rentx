import { Request, Response } from "express";
import { container } from "tsyringe";

import { UploadCarImagesUseCase } from "./uploadCarImagesUseCase";

interface IFile {
    filename: string;
}

class UploadCarImagesController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { car_id } = request.params;
        const images = request.files as IFile[];

        const uploadCarImagesUseCase = container.resolve(
            UploadCarImagesUseCase
        );

        const images_names = images.map((file) => file.filename);

        await uploadCarImagesUseCase.execute({
            car_id,
            images_names,
        });

        return response.status(200).send();
    }
}

export { UploadCarImagesController };
