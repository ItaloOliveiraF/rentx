import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateRentals1624124242520 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "rentals",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "car_id",
                        type: "uuid",
                    },
                    {
                        name: "user_id",
                        type: "uuid",
                    },
                    {
                        name: "start_date",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "end_date",
                        type: "timestamp",
                        isNullable: true,
                    },
                    {
                        name: "expected_return_date",
                        type: "timestamp",
                    },
                    {
                        name: "total",
                        type: "numeric",
                        isNullable: true,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
                foreignKeys: [
                    {
                        name: "FKCarRental",
                        columnNames: ["car_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "cars",
                        onUpdate: "SET NULL",
                        onDelete: "SET NULL",
                    },
                    {
                        name: "FKUserRental",
                        columnNames: ["user_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "users",
                        onUpdate: "SET NULL",
                        onDelete: "SET NULL",
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("rentals");
    }
}
