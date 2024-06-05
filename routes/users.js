// Require express and instantiate the router
const express = require("express");
const router = express.Router();

// Require the users controller
const controller = require("../controllers/users");

// Require the module that stores the path to be redirected to
const { storeReturnTo } = require("../middleware");

// Authentication
const passport = require("passport");

// Error handling
const catchAsync = require("../utils/catchAsync");


// Display register form -- Reigster user
router.route("/register")
    .get(controller.renderRegisterForm)
    .post(catchAsync(controller.registerUser))

// Display login form -- Login user
router.route("/login")
    .get(controller.renderLoginForm)
    .post(storeReturnTo,
        passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), controller.loginUser)

// Logout user
router.get("/logout", controller.logoutUser)


module.exports = router;