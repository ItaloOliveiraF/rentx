import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";

import { ICarsRepository } from "../ICarsRepository";

class CarsRepositoryInMemory implements ICarsRepository {
    cars: Car[] = [];

    async create({
        name,
        description,
        daily_rate,
        license_plate,
        fine_amount,
        brand,
        category_id,
        specifications,
        id,
    }: ICreateCarDTO): Promise<Car> {
        let car: Car;

        if (id) {
            car = this.cars.find((car) => car.id === id);
            const carIndex = this.cars.indexOf(car);

            car.specifications = specifications;

            this.cars[carIndex].specifications = specifications;
        } else {
            car = new Car();

            Object.assign(car, {
                name,
                description,
                daily_rate,
                license_plate,
                fine_amount,
                brand,
                category_id,
                specifications,
            });

            this.cars.push(car);
        }

        return car;
    }

    async findByLicensePlate(license_plate: string): Promise<Car> {
        return this.cars.find((car) => car.license_plate === license_plate);
    }

    async findAvailable(
        name?: string,
        brand?: string,
        category_id?: string
    ): Promise<Car[]> {
        const availableCars = this.cars.filter((car) => car.available);
        let filteredAvailableCars = availableCars;

        if (name) {
            filteredAvailableCars = filteredAvailableCars.filter(
                (car) => car.name === name
            );
        }

        if (brand) {
            filteredAvailableCars = filteredAvailableCars.filter(
                (car) => car.brand === brand
            );
        }

        if (category_id) {
            filteredAvailableCars = filteredAvailableCars.filter(
                (car) => car.category_id === category_id
            );
        }

        return filteredAvailableCars;
    }

    async findById(id: string): Promise<Car> {
        return this.cars.find((car) => car.id === id);
    }

    async updateAvailable(id: string, available: boolean): Promise<void> {
        const carIndex = this.cars.findIndex((car) => car.id === id);
        this.cars[carIndex].available = available;
    }
}

export { CarsRepositoryInMemory };
