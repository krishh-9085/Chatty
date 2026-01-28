import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

// 🔥 IMPORTANT: Use Render's injected PORT
const PORT = process.env.PORT;

if (!PORT) {
    throw new Error("PORT is not defined");
}

// Middlewares
app.use(express.json({ limit: "5mb" }));
app.use(
    cors({
        origin: ENV.CLIENT_URL,
        credentials: true,
    })
);
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Connect DB first, then start server
connectDB()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to start server:", err);
        process.exit(1);
    });
