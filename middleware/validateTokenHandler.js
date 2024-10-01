const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { isTokenBlacklisted } = require("../config/blacklist");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.Authorization || req.headers.authorization;

    // Check for token in the authorization header
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];

        // Check if the token is blacklisted
        if (isTokenBlacklisted(token)) {
            return res.status(401).json({ message: "Token is invalid, please log in again!" });
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "User is not authorized" });
            }
            req.user = decoded.user; // Attach the user info to the request object
            next(); // Proceed to the next middleware
        });
    } else {
        // If no token is provided
        return res.status(401).json({ message: "User is not authorized or token is missing" });
    }
});

module.exports = validateToken;
