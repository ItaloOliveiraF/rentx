import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { CreateCarUseCase } from "../createCar/CreateCarUseCase";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

describe("List available cars", () => {
    let carsRepository: CarsRepositoryInMemory;
    let listAvailableCarsUseCase: ListAvailableCarsUseCase;
    let createCarUseCase: CreateCarUseCase;

    beforeEach(() => {
        carsRepository = new CarsRepositoryInMemory();
        listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepository);
        createCarUseCase = new CreateCarUseCase(carsRepository);
    });

    it("should be possible list all available cars", async () => {
        const car1 = await createCarUseCase.execute({
            name: "Car 1",
            description: "Description Car 1",
            daily_rate: 100,
            license_plate: "ABC-1234",
            fine_amount: 60,
            brand: "Brand Car 1 ",
            category_id: "category 1",
        });

        const car2 = await createCarUseCase.execute({
            name: "Car 2",
            description: "Description Car 2",
            daily_rate: 100,
            license_plate: "DEF-1234",
            fine_amount: 60,
            brand: "Brand Car 2 ",
            category_id: "category 2",
        });

        const cars = await listAvailableCarsUseCase.execute({});

        expect(cars).toEqual([car1, car2]);
    });

    it("should be possible list available cars by category", async () => {
        const car1 = await createCarUseCase.execute({
            name: "Car 1",
            description: "Description Car 1",
            daily_rate: 100,
            license_plate: "ABC-1234",
            fine_amount: 60,
            brand: "Brand",
            category_id: "1234",
        });

        const car2 = await createCarUseCase.execute({
            name: "Car 2",
            description: "Description Car 2",
            daily_rate: 100,
            license_plate: "DEF-1234",
            fine_amount: 60,
            brand: "Brand",
            category_id: "1234",
        });

        await createCarUseCase.execute({
            name: "Car With Different Category",
            description: "Description Car",
            daily_rate: 100,
            license_plate: "DEF-5678",
            fine_amount: 60,
            brand: "Brand",
            category_id: "5678",
        });

        const cars = await listAvailableCarsUseCase.execute({
            category_id: "1234",
        });

        expect(cars).toEqual([car1, car2]);
    });

    it("should be possible list available cars by name", async () => {
        const car1 = await createCarUseCase.execute({
            name: "EqualName",
            description: "Description Car 1",
            daily_rate: 100,
            license_plate: "ABC-1234",
            fine_amount: 60,
            brand: "Brand",
            category_id: "1234",
        });

        const car2 = await createCarUseCase.execute({
            name: "EqualName",
            description: "Description Car 2",
            daily_rate: 100,
            license_plate: "DEF-1234",
            fine_amount: 60,
            brand: "Brand",
            category_id: "1234",
        });

        await createCarUseCase.execute({
            name: "Car With Different name",
            description: "Description Car",
            daily_rate: 100,
            license_plate: "DEF-5678",
            fine_amount: 60,
            brand: "Brand",
            category_id: "1234",
        });

        const cars = await listAvailableCarsUseCase.execute({
            name: "EqualName",
        });

        expect(cars).toEqual([car1, car2]);
    });
    it("should be possible list available cars by brand", async () => {
        await createCarUseCase.execute({
            name: "Car With Different Brand",
            description: "Description Car 1",
            daily_rate: 100,
            license_plate: "ABC-1234",
            fine_amount: 60,
            brand: "Brand Different",
            category_id: "1234",
        });

        const car2 = await createCarUseCase.execute({
            name: "Car 2",
            description: "Description Car 2",
            daily_rate: 100,
            license_plate: "DEF-1234",
            fine_amount: 60,
            brand: "BrandEqual",
            category_id: "1234",
        });

        const car3 = await createCarUseCase.execute({
            name: "Car 3",
            description: "Description Car",
            daily_rate: 100,
            license_plate: "DEF-5678",
            fine_amount: 60,
            brand: "BrandEqual",
            category_id: "5678",
        });

        const cars = await listAvailableCarsUseCase.execute({
            brand: "BrandEqual",
        });

        expect(cars).toEqual([car2, car3]);
    });
});
