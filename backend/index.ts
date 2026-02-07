import app from "./src/app";
import { connectDB } from "./src/config/database";
import { createServer } from "http";
import { setServers } from "node:dns/promises";
import { initializeSocket } from "./src/utils/socket";

setServers(["1.1.1.1", "8.8.8.8"]);

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

initializeSocket(httpServer);

connectDB().then(() => {
    httpServer.listen(PORT, () => {
        console.log("Server is up and running on PORT : ", PORT);
    });
}).catch((err) => {
    console.log("Failed to start server :", err);
    process.exit(1);
});