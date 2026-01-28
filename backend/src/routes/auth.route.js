import express from "express";
import { signup, login, logout, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// ❌ DO NOT use Arcjet globally on auth routes

router.post("/signup", arcjetProtection, signup);
router.post("/login", arcjetProtection, login);
router.post("/logout", protectRoute, logout);

router.put("/update-profile", protectRoute, updateProfile);

// ✅ Auth check MUST be clean (no Arcjet)
router.get("/check", protectRoute, (req, res) => {
    res.status(200).json(req.user);
});

export default router;
