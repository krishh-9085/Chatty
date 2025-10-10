// const express = require('express');
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import Path from "path";
dotenv.config();

const PORT = process.env.PORT || 3000;
const __dirname = Path.resolve();
const app = express();

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

//make ready for deployment
if (process.env.NODE_ENV === "production") {
    app.use(express.static(Path.join(__dirname, "../frontend/dist")));
    app.get("*", (_, res) => {
        res.sendFile(Path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}



app.listen(PORT, () => console.log("Server is running on port: " + PORT));