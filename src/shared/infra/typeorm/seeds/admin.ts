import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";

import databaseConnection from "../index";

async function create(): Promise<void> {
    const connection = await databaseConnection("localhost");
    const id = uuidV4();
    const password = await hash("admin", 8);
    await connection.query(`INSERT INTO USERS(id, name, email, password, "is_admin", driver_license)
    values('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'XXXXXX')`);

    await connection.close();
}

create().then(() => {
    console.log("Admin User created");
});
