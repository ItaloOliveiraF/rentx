import dayjs from "dayjs";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

describe("Create Rental", () => {
    let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
    let carsRepositoryInMemory: CarsRepositoryInMemory;
    let createRentalUseCase: CreateRentalUseCase;
    let add24Hours: Date;
    let dayjsDateProvider: DayjsDateProvider;

    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        dayjsDateProvider = new DayjsDateProvider();
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepositoryInMemory,
            dayjsDateProvider,
            carsRepositoryInMemory
        );

        add24Hours = dayjs().add(1, "day").add(1, "minute").toDate();
    });

    it("should be able to create a new rental", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car Test",
            description: "Car Description",
            brand: "Brand",
            daily_rate: 100,
            fine_amount: 20,
            license_plate: "1234",
            category_id: "1234",
        });

        const rental = await createRentalUseCase.execute({
            car_id: car.id,
            user_id: "abcd",
            expected_return_date: add24Hours,
        });
        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("start_date");
    });

    it("Should not be able to create a new rental with a unavailable car", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Car Test Rental",
            description: "Car Test Description",
            brand: "Brand",
            daily_rate: 100,
            fine_amount: 20,
            license_plate: "12345",
            category_id: "1234",
        });

        await createRentalUseCase.execute({
            car_id: car.id,
            user_id: "abcd",
            expected_return_date: add24Hours,
        });

        await expect(
            createRentalUseCase.execute({
                car_id: car.id,
                user_id: "efgh",
                expected_return_date: add24Hours,
            })
        ).rejects.toEqual(new AppError("The car is unavailable."));
    });

    it("Should not be able to create a new rental to a user with another rental in progress", async () => {
        const car1 = await carsRepositoryInMemory.create({
            name: "Car Test Rental user 1",
            description: "Car Test Description",
            brand: "Brand",
            daily_rate: 100,
            fine_amount: 20,
            license_plate: "123456",
            category_id: "1234",
        });

        const car2 = await carsRepositoryInMemory.create({
            name: "Car Test Rental user 2",
            description: "Car Test Description",
            brand: "Brand",
            daily_rate: 100,
            fine_amount: 20,
            license_plate: "6789",
            category_id: "1234",
        });

        await createRentalUseCase.execute({
            car_id: car1.id,
            user_id: "abcd",
            expected_return_date: add24Hours,
        });

        await expect(
            createRentalUseCase.execute({
                car_id: car2.id,
                user_id: "abcd",
                expected_return_date: add24Hours,
            })
        ).rejects.toEqual(new AppError("The user have a rental in progress."));
    });

    it("Should not be able to create a new rental with invalid return time", async () => {
        await expect(
            createRentalUseCase.execute({
                car_id: "1234",
                user_id: "abcd",
                expected_return_date: new Date(),
            })
        ).rejects.toEqual(new AppError("Invalid expected return time."));
    });
});
