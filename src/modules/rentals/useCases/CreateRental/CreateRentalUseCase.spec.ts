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
        const rental = await createRentalUseCase.execute({
            car_id: "1234",
            user_id: "abcd",
            expected_return_date: add24Hours,
        });

        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("start_date");
    });

    it("Should not be able to create a new rental with a unavailable car", async () => {
        await expect(async () => {
            await createRentalUseCase.execute({
                car_id: "1234",
                user_id: "abcd",
                expected_return_date: add24Hours,
            });
            await createRentalUseCase.execute({
                car_id: "1234",
                user_id: "efgh",
                expected_return_date: add24Hours,
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("Should not be able to create a new rental to a user with another rental in progress", async () => {
        await expect(async () => {
            await createRentalUseCase.execute({
                car_id: "1234",
                user_id: "abcd",
                expected_return_date: add24Hours,
            });
            await createRentalUseCase.execute({
                car_id: "2345",
                user_id: "abcd",
                expected_return_date: add24Hours,
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("Should not be able to create a new rental with invalid return time", async () => {
        await expect(async () => {
            await createRentalUseCase.execute({
                car_id: "1234",
                user_id: "abcd",
                expected_return_date: new Date(),
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});
