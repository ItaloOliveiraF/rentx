import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
    rental_id: string;
}

@injectable()
class DevolutionRentalUseCase {
    constructor(
        @inject("RentalsRepository")
        private rentalsRepository: IRentalsRepository,
        @inject("CarsRepository")
        private carsRepository: ICarsRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) {}

    async execute({ rental_id }: IRequest): Promise<Rental> {
        const minimum_daily = 1;
        const rental = await this.rentalsRepository.findById(rental_id);

        if (!rental) {
            throw new AppError("Rental does not exists");
        }

        const endDate = this.dateProvider.dateNow();

        let daily = this.dateProvider.compareInDays(rental.start_date, endDate);

        if (daily < minimum_daily) {
            daily = minimum_daily;
        }

        let delay = this.dateProvider.compareInDays(
            rental.expected_return_date,
            endDate
        );

        if (delay < 0) {
            delay = 0;
        }

        const car = await this.carsRepository.findById(rental.car_id);

        const total = daily * car.daily_rate + delay * car.fine_amount;

        rental.end_date = endDate;
        rental.total = total;

        this.rentalsRepository.create(rental);

        this.carsRepository.updateAvailable(rental.car_id, true);

        return rental;
    }
}

export { DevolutionRentalUseCase };
