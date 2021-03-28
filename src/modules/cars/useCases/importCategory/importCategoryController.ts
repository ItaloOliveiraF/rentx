import { Request, Response } from "express";

import { ImportCategoryUseCase } from "./importCategoryUseCase";

class ImportCategoryController {
    constructor(private importCategoryUseCase: ImportCategoryUseCase) {}
    execute(request: Request, response: Response): Response {
        const { file } = request;
        this.importCategoryUseCase.handle(file);
        return response.send();
    }
}

export { ImportCategoryController };
