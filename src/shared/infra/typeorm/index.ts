import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (host = "database_ignite"): Promise<Connection> => {
    const options = await getConnectionOptions();

    Object.assign(options, {
        host,
    });

    return createConnection(options);
};
