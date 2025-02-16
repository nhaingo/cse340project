// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/index")
const regValidate = require("../utilities/account-validation")


// Deliver the registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))
// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)
//Route to build Account Management View
router.get("/account-management", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Route to build account view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.post("/login", 
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);




module.exports = router;