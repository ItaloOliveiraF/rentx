import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
    compareInHours(start_date: Date, end_date: Date): number {
        const startDateLocal = this.convertToLocalTime(start_date);
        const endDateLocal = this.convertToLocalTime(end_date);

        return dayjs(endDateLocal).diff(startDateLocal, "hours");
    }

    convertToLocalTime(date: Date): Date {
        return dayjs(date).utc().local().toDate();
    }

    dateNow(): Date {
        return dayjs().toDate();
    }

    compareInDays(start_date: Date, end_date: Date): number {
        const startDateLocal = this.convertToLocalTime(start_date);
        const endDateLocal = this.convertToLocalTime(end_date);

        return dayjs(endDateLocal).diff(startDateLocal, "days");
    }

    addDays(start_date: Date, days: number): Date {
        const startDateLocal = this.convertToLocalTime(start_date);

        return dayjs(startDateLocal).add(days, "days").toDate();
    }
}

export { DayjsDateProvider };
