// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/index")
const regValidate = require("../utilities/account-validation")

//Deliver the login View
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Deliver the registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process registration
router.post('/register', utilities.handleErrors(accountController.registerAccount))

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

module.exports = router;