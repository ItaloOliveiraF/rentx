interface IDateProvider {
    compareInHours(start_date: Date, end_date: Date): number;
    convertToLocalTime(date: Date): Date;
    dateNow(): Date;
}

export { IDateProvider };
