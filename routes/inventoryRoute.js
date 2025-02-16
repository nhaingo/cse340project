// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

//Route to build inventory by single image view
router.get("/detail/:inventoryId", invController.buildByInventoryId)

//Route to Vehicle Management view
router.get("/", utilities.handleErrors(invController.buildManagementView))
//router.use("/", invController.buildManagementView)

// Route for Classification management
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))
router.post("/add-classification", invValidate.classificationRules(), invValidate.checkClassificationData, utilities.handleErrors(invController.addClassification))

// Route for Inventory management 
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))
router.post("/add-inventory", invValidate.inventoryRules(), invValidate.checkInventoryData, utilities.handleErrors(invController.addInventory))

//New route for inventory
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Build edit/update inventory views
router.get("/edit/:inventoryId", utilities.handleErrors(invController.buildEditInventory));
router.post("/update/", invValidate.inventoryRules(), invValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory));

module.exports = router
