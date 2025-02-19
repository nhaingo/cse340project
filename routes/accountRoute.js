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
)

//Route to build Account Logout View
router.get("/logout", utilities.handleErrors(accountController.accountLogout));


//Deliver the update account view
router.get("/update/:accountId", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountUpdate))
router.post("/update", regValidate.updateRules(), regValidate.checkUpdateData, utilities.handleErrors(accountController.updateAccount))
router.post("/update-password", regValidate.updatePasswordRules(), regValidate.checkUpdatePasswordData, utilities.handleErrors(accountController.updatePassword))

//Route to deliver account delete view
router.get("/delete-account/:accountId", utilities.handleErrors(accountController.deleteView))
router.post("/delete-account", utilities.handleErrors(accountController.deleteAccount))



module.exports = router;