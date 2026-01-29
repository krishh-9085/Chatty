import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";
import { ENV } from "../lib/env.js";

// Always set strict CORS headers (NO wildcard)
const setCorsHeaders = (res) => {
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
};

export const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);

        if (decision.isDenied()) {
            setCorsHeaders(res);

            if (decision.reason.isRateLimit()) {
                return res.status(429).json({
                    message: "Rate limit exceeded. Please try again later.",
                });
            }

            if (decision.reason.isBot()) {
                return res.status(403).json({
                    message: "Bot access denied.",
                });
            }

            return res.status(403).json({
                message: "Access denied by security policy.",
            });
        }

        if (decision.results.some(isSpoofedBot)) {
            setCorsHeaders(res);
            return res.status(403).json({
                message: "Malicious bot activity detected.",
            });
        }

        next();
    } catch (error) {
        console.error("Arcjet Protection Error:", error);
        next();
    }
};
