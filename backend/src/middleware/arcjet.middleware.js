import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

// 🔥 Helper to ALWAYS set CORS headers on early responses
const setCorsHeaders = (res) => {
    res.setHeader(
        "Access-Control-Allow-Origin",
        process.env.CLIENT_URL
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
};

export const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);

        if (decision.isDenied()) {
            setCorsHeaders(res);

            if (decision.reason.isRateLimit()) {
                return res
                    .status(429)
                    .json({ message: "Rate limit exceeded. Please try again later." });
            }

            if (decision.reason.isBot()) {
                return res
                    .status(403)
                    .json({ message: "Bot access denied." });
            }

            return res
                .status(403)
                .json({ message: "Access denied by security policy." });
        }

        // Spoofed bot check
        if (decision.results.some(isSpoofedBot)) {
            setCorsHeaders(res);
            return res.status(403).json({
                error: "Spoofed bot detected",
                message: "Malicious bot activity detected.",
            });
        }

        next();
    } catch (error) {
        console.error("Arcjet Protection Error:", error);
        next();
    }
};
