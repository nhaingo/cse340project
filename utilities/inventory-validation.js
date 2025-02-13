const utilities = require("../utilities");
/*const invModel = require("../models/inventory-model");*/
const { body, validationResult } = require("express-validator");
const validate = {};

/* **********************************
 *  Add classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    // firstname is required and must be string
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isAlphanumeric()
      .isLength({ min: 1 })
      .withMessage("Please provide a valid classification name."), 
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/addClassification", { // Try again
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
};

/* **********************************
 *  Add inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    // Make is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Make value is missing")
      .isLength({ min: 1 })
      .withMessage("Please, enter a value for make."), // on error this message is sent.

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please, enter a value for model."),

    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Year is missing")
      .isNumeric()
      .withMessage("Enter a year (4 digits)"),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please, provide a description."),

    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Image is missing."),

    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail."),

    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Price value is missing.")
      .isNumeric()
      .withMessage("Please, enter a price in a valid format (no comma, no period)"),

    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Miles value is missing.")
      .isNumeric()
      .withMessage("Please, enter the Miles (number, no comma, no period)"),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Color is missing"),

    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .isInt()
      .withMessage("Please, select a classification from the drop-down menu"),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);

  if (!errors.isEmpty()) {
    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;
    let classifications = await utilities.buildClassificationList(
      classification_id
    );
    let nav = await utilities.getNav();
    res.render("inventory/addInventory", { 
      errors,
      title: "Add Inventory",
      nav,
      classifications,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

/* ******************************
 * Check data and return errors or continue to update. Errors will redirect to edit view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);

  if (!errors.isEmpty()) {
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body;
    let classifications = await utilities.buildClassificationList(
      classification_id
    );
    let nav = await utilities.getNav()
    res.render("inventory/editInventory", { 
      errors,
      title: "Edit " + inv_make + " " + inv_model,
      nav,
      classifications,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}


module.exports = validate