const utilities = require("../utilities/")
const accountModel =require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


  /* *****************************************
  * Deliver registration view
  * ****************************************** */
  async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

   // Hash the password before storing
   let hashedPassword
   try {
     // regular password and cost (salt is generated automatically)
     hashedPassword = await bcrypt.hashSync(account_password, 10)
   } catch (error) {
     req.flash("notice", 'Sorry, there was an error processing the registration.')
     res.status(500).render("account/register", {
       title: "Registration",
       nav,
       errors: null,
     })
   }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    errors: null,
    nav,
  });
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/account-management")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Deliver management view
 * *************************************** */
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()

  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Process logout request
 * ************************************ */
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  delete res.locals.accountData;
  res.locals.loggedin = 0;
  req.flash("notice", "Logout successful.")
  res.redirect("/")
  return
}

/* *****************************************
  * Deliver update view
  * ****************************************** */

async function buildAccountUpdate(req, res, next) {
  let nav = await utilities.getNav()

  const accountDetails = await accountModel.getAccountByAccountId(req.params.accountId);
  const {account_id, account_firstname, account_lastname, account_email} = accountDetails
  if (!accountDetails) {
    req.flash("notice", "Account not found.");
    return res.redirect("/account/account-management"); // Redirect instead of crashing
  } else {
  res.render("account/update", {
    title: "Update",
    nav,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email
  })
}
}

/* ******************************
 *  Process account update request
 * ******************************* */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  } = req.body

  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  )

  if (updateResult) {
    req.flash(
      "notice",
      `Congratulations, ${account_firstname}. Your account is updated`
    )

    //Update the cookie accountData
    const accountData = await accountModel.getAccountByAccountId(account_id)
    delete accountData.account_password
    res.locals.accountData.account_firstname = accountData.account_firstname
    utilities.updateCookie(accountData, res)

    res.status(201).render("account/account-management", {
      title: "Management",
      errors: null,
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("account/update", {
      title: "Update",
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      nav,
    })
  }
}

/* **********************************
 *  Process password update request
 * ******************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav()

  const { account_id, account_password } = req.body;

  // Hash the password before storing.
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the password update."
    )
    res.status(500).render("account/update", {
      title: "Update",
      nav,
      errors: null,
    })
  }

  const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

  if (updateResult) {
    req.flash(
      "notice",
      `Congratulations, your password is updated.`
    );
    res.status(201).render("account/account-management", {
      title: "Manage",
      errors: null,
      nav,
    })
  } else {
    req.flash("notice", "Sorry, attempt to update password failed.");
    res.status(501).render("account/update", {
      title: "Update",
      errors: null,
      nav,
    })
  }
}

/* Build delete account view*/
async function deleteView(req, res, next) {
  try {
    let nav = await utilities.getNav();

    const accountDetails = await accountModel.getAccountByAccountId(req.params.accountId);
    if (!accountDetails) {
      req.flash("notice", "Account not found.");
      return res.redirect("/account/account-management"); // Redirect instead of crashing
    }

    const {account_id, account_firstname, account_lastname, account_email} = accountDetails;

    res.render("account/delete-account", {
      title: "Delete Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    });
  } catch (error) {
    // Log the error for debugging
    console.error('Error in deleteView:', error);
    next(error); // Pass error to error handling middleware
  }
}

/* Delete Account Item*/
async function deleteAccount(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const accountId = parseInt(req.body.account_id);
    
    // Destructure after the check for accountId to ensure all fields are present
    const { account_id, account_lastname, account_firstname, account_email } = req.body;
    
    // Ensure accountId is a valid number before proceeding
    if (isNaN(accountId)) {
      throw new Error("Invalid account ID provided");
    }

    const deleteResult = await accountModel.deleteAccountName(accountId);
    const accountName = `${account_lastname} ${account_firstname}`;

    if (deleteResult) {
      req.flash("notice", `The ${accountName} account was successfully deleted.`);

      res.redirect("/account/logout");
    } else {
      req.flash("notice", "Sorry, the delete failed.");
      res.status(500).render("account/delete-account", {
        title: "Delete " + accountName,
        nav,
        errors: [{ msg: "Failed to delete account" }], // Add an error message
        account_id,
        account_lastname,
        account_firstname,
        account_email,
      });
    }
  } catch (error) {
    console.error('Error in deleteAccount:', error);
    req.flash("error", "An error occurred while deleting the account.");
    res.status(500).render("account/delete-account", {
      title: "Delete Account",
      nav,
      errors: [{ msg: error.message }], // Pass error message to view
      account_id: req.body.account_id || null, // Ensure we have some data to show
      account_lastname: req.body.account_lastname || null,
      account_firstname: req.body.account_firstname || null,
      account_email: req.body.account_email || null,
    });
  }
}
  module.exports = { buildRegister, registerAccount, buildLogin, accountLogin, buildAccountManagement, accountLogout, buildAccountUpdate, updateAccount, updatePassword, deleteView, deleteAccount }
