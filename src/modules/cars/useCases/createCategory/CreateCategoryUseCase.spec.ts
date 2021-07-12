import { ICategoriesRepository } from "@modules/cars/repositories/ICategoriesRepository";
import { CategoriesRepositoryInMemory } from "@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

let categoriesRepositoryInMemory: ICategoriesRepository;
let createCategory: CreateCategoryUseCase;

describe("Create a new category", () => {
    beforeEach(() => {
        categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
        createCategory = new CreateCategoryUseCase(
            categoriesRepositoryInMemory
        );
    });

    it("Should be able to create a new category", async () => {
        const category = {
            name: "Category test",
            description: "Category description test",
        };

        await createCategory.execute({
            name: category.name,
            description: category.description,
        });

        const newCategory = await categoriesRepositoryInMemory.findByName(
            category.name
        );

        expect(newCategory).toHaveProperty("id");
    });

    it("Should not be able to create a new category with name exists", async () => {
        const category = {
            name: "Category test",
            description: "Category description test",
        };

        await createCategory.execute({
            name: category.name,
            description: category.description,
        });

        await expect(
            createCategory.execute({
                name: category.name,
                description: category.description,
            })
        ).rejects.toEqual(new AppError("Category already exists!"));
    });
});
