import { ICreateCarsImages } from "../dtos/ICreateCarsImagesDTO";
import { CarImage } from "../infra/typeorm/entities/CarImage";

interface ICarsImagesRepository {
    create({ car_id, image_name }: ICreateCarsImages): Promise<CarImage>;
}

export { ICarsImagesRepository };
