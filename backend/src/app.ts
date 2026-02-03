import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

// app.get("/health", (req, res) => {
//     res.json({ status: "ok", message: "Server is runnig." });
// });

export default app;