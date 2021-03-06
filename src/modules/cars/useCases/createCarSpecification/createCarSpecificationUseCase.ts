import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { ISpecificationsRepository } from "@modules/cars/repositories/ISpecificationsRepository";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
    car_id: string;
    specifications_ids: string[];
}

@injectable()
class CreateCarSpecificationUseCase {
    constructor(
        @inject("CarsRepository")
        private carsRepository: ICarsRepository,
        @inject("SpecificationsRepository")
        private specificationsRepository: ISpecificationsRepository
    ) {}

    async execute({ car_id, specifications_ids }: IRequest): Promise<void> {
        const car = await this.carsRepository.findById(car_id);

        if (!car) {
            throw new AppError("Car don't exists");
        }

        const specifications = await this.specificationsRepository.findByIds(
            specifications_ids
        );

        car.specifications = specifications;

        await this.carsRepository.create(car);
    }
}

export { CreateCarSpecificationUseCase };
