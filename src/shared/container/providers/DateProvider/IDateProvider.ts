interface IDateProvider {
    compareInHours(start_date: Date, end_date: Date): number;
    convertToLocalTime(date: Date): Date;
    dateNow(): Date;
    compareInDays(start_date: Date, end_date: Date): number;
    addDays(start_date: Date, days: number): Date;
}

export { IDateProvider };
