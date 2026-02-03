import app from "./src/App";
import { connectDB } from "./src/config/database";
import { setServers } from "node:dns/promises";

setServers(["1.1.1.1", "8.8.8.8"]);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is up and running on PORT : ", PORT);
    });
});