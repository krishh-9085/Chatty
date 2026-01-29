import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

/* ----------------------------------
   1️⃣ GLOBAL CORS HEADERS (CRITICAL)
----------------------------------- */
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", ENV.CLIENT_URL);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,DELETE,OPTIONS"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

/* ----------------------------------
   2️⃣ CORS MIDDLEWARE
----------------------------------- */
app.use(
    cors({
        origin: ENV.CLIENT_URL,
        credentials: true,
    })
);

/* ----------------------------------
   3️⃣ MIDDLEWARE
----------------------------------- */
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

/* ----------------------------------
   4️⃣ ROUTES
----------------------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

/* ----------------------------------
   5️⃣ START SERVER (Render-safe)
----------------------------------- */
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    server.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`✅ Allowed client: ${ENV.CLIENT_URL}`);
    });
});
