const express = require("express");
const {registerUser,
    currentUser,
    loginUser,
    updateUser,
    logoutUser,
    requestPasswordReset,
    resetPassword
} = require("../controllers/userController.js");
const validateToken = require("../middleware/validateTokenHandler.js");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", validateToken, logoutUser);
router.get("/current", validateToken, currentUser);
router.put("/update", validateToken, updateUser);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);


module.exports = router