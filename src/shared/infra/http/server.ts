import createDatabaseConnection from "../typeorm";
import { app } from "./app";

createDatabaseConnection();

app.listen(3333, () => {
    console.log("Listen server");
});
