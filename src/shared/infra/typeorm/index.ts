import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (host = "database_ignite"): Promise<Connection> => {
    const options = await getConnectionOptions();

    Object.assign(options, {
        host: process.env.NODE_ENV === "test" ? "localhost" : host,
        database:
            process.env.NODE_ENV === "test" ? "rentx_test" : options.database,
    });

    return createConnection(options);
};
