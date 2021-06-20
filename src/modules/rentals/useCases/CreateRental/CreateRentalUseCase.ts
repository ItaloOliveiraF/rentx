import { inject, injectable } from "tsyringe";

import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
    user_id: string;
    car_id: string;
    expected_return_date: Date;
}

@injectable()
class CreateRentalUseCase {
    constructor(
        @inject("RentalsRepository")
        private rentalsRepository: IRentalsRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) {}
    async execute({
        user_id,
        car_id,
        expected_return_date,
    }: IRequest): Promise<Rental> {
        const MIN_RENTAL_TIME_IN_HOURS = 24;
        // Não deve ser possível criar um novo aluguel se o carro já estiver em uso
        const openRentalByCar = await this.rentalsRepository.findOpenRentalByCar(
            car_id
        );

        if (openRentalByCar) {
            throw new AppError("The car is unavailable.");
        }

        // Não deve ser possível criar um novo aluguel se o usuário já possuir um aluguel em progresso
        const openRentalByUser = await this.rentalsRepository.findOpenRentalByUser(
            user_id
        );

        if (openRentalByUser) {
            throw new AppError("The user have a rental in progress.");
        }

        // Não deve ser possível criar um aluguel com menos de 24h de duração

        const compare = this.dateProvider.compareInHours(
            this.dateProvider.dateNow(),
            expected_return_date
        );

        if (compare < MIN_RENTAL_TIME_IN_HOURS) {
            throw new AppError("Invalid expected return time.");
        }

        const rental = await this.rentalsRepository.create({
            user_id,
            car_id,
            expected_return_date,
        });

        return rental;
    }
}

export { CreateRentalUseCase };
