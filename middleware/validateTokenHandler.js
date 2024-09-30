const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { isTokenBlacklisted } = require("../config/blacklist");
const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1];
        if (isTokenBlacklisted(token)) {
            return res.status(401).json({ message: "Token is invalid, please log in again!" });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
            if(err){
                res.status(401);
                throw new Error("User is not authorized");
            }
  
            req.user = decoded.user;
            next();
        });
        if(!token){
            res.status(401);
                throw new Error("User is not authorized or token is missing");
        } 
    }
})

module.exports = validateToken;