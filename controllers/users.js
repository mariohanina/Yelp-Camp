const User = require("../models/user");


// Display register form
module.exports.renderRegisterForm = (req, res) => {
    res.render("users/register");
}

// Reigster user
module.exports.registerUser = async (req, res) => {
    try {
        // Extract the username, email, and password from the user's input
        const { username, email, password } = req.body;
        // Create a new user with the provided username and email
        const user = new User({ username, email });
        // Create a hashed password using passport's method
        const registeredUser = await User.register(user, password);

        // After we create a user, log them in
        req.login(registeredUser, err => {
            if (err) return next(err);
            // Flash, and redirect
            req.flash("success", "Welcome to Yelp Camp!");
            res.redirect("/campgrounds");
        })

    } catch (error) {
        // In case of an error, flash error and redirect
        req.flash("error", error.message);
        res.redirect("/register")
    }
}

// Display login form 
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
}

// Login user
module.exports.loginUser = (req, res) => {
    // if user was trying to access specific url, store in variable, otherwise, store campgrounds
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    req.flash("success", "Welcome back!");
    res.redirect(redirectUrl);
}

// Logout user
module.exports.logoutUser = (req, res) => {
    req.logout((error) => {
        if (error) return next(error);
        req.flash("success", "Adios!");
        res.redirect("/campgrounds");
    });
}