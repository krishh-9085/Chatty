import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const PORT = process.env.PORT;
if (!PORT) throw new Error("PORT is not defined");

// ✅ PRE-FLIGHT FIRST (CRITICAL)
app.options("*", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", ENV.CLIENT_URL);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,DELETE,OPTIONS"
    );
    return res.sendStatus(204);
});

// ✅ CORS SECOND
app.use(
    cors({
        origin: ENV.CLIENT_URL,
        credentials: true,
    })
);

// Other middleware
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Start server
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
