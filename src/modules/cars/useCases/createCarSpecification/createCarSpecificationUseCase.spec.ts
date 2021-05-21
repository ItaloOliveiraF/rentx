import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory";

import { CreateCarSpecificationUseCase } from "./createCarSpecificationUseCase";

describe("Create a new specification of a car", () => {
    let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
    let carsRepository: CarsRepositoryInMemory;
    let specificationsRepository: SpecificationsRepositoryInMemory;

    beforeEach(() => {
        carsRepository = new CarsRepositoryInMemory();
        specificationsRepository = new SpecificationsRepositoryInMemory();
        createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
            carsRepository,
            specificationsRepository
        );
    });

    it("should be able to add a specification to a car", async () => {
        const car = await carsRepository.create({
            name: "Car 1",
            description: "Description Car 1",
            daily_rate: 100,
            license_plate: "ABC-1234",
            fine_amount: 60,
            brand: "Brand Car 1 ",
            category_id: "category 1",
        });

        const specification = await specificationsRepository.create({
            name: "Specification Test",
            description: "Specification test description",
        });

        const carSpecification = {
            car_id: car.id,
            specifications_ids: [specification.id],
        };

        await createCarSpecificationUseCase.execute(carSpecification);

        const updatedCar = await carsRepository.findById(car.id);

        expect(updatedCar.specifications).toStrictEqual([specification]);
    });
});
