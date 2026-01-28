import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

// 🔥 Render provides this
const PORT = process.env.PORT;
if (!PORT) throw new Error("PORT is not defined");

// ✅ CORS MUST BE FIRST
app.use(
    cors({
        origin: ENV.CLIENT_URL,
        credentials: true,
    })
);

// Then other middleware
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Start server
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
