const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}
/* *****************************
* Build the view to display any vehicle information
* ***************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventoryId = req.params.inventoryId;
  const data = await invModel.getInventoryByInventoryId(inventoryId)
  const listing = await utilities.buildItemListing(data[0])
  let nav = await utilities.getNav()
  const itemName = `${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/listing", {
    title: itemName,
    nav,
    listing,
  })
}

/**********************************
 * Build the vehicle management view
 **********************************/

invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    errors: null,
    nav,
    classificationSelect,
  })
}

/* ***********************************
* Build the add classification view
* ************************************ */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()

  res.render("inventory/addClassification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* **************************************************
* Handle post request to add a vehicle classification
* **************************************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body

  const response = await invModel.addClassification(classification_name)
  let nav = await utilities.getNav()
  if (response) {
    req.flash(
      "notice",
      `The "${classification_name}" classification was successfully added.`
    )
    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classification_name,
      errors: null,
    })
  } else {
    req.flash("notice", `Failed to add ${classification_name}`)
    res.render("inventory/addClassification", {
      title: "Add New Classification",
      errors: null,
      nav,
      classification_name,
    })
  }
}

/* *******************************
* Build the add inventory view
* ******************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classifications = await utilities.buildClassificationList()

  res.render("inventory/addInventory", {
    title: "Add Vehicle",
    errors: null,
    nav,
    classifications,
  })
}

/* *****************************************************
* Handle post request to add a vehicle to the inventory 
* ****************************************************** */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()

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
  } = req.body

  const response = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (response) {
    req.flash(
      "notice",
      `The ${inv_year} ${inv_make} ${inv_model} is successfully added.`
    );
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
      errors: null,
    })
  } else {
    req.flash("notice", "Attempt to add a new vehicle failed")
    res.render("inventory/addInventory", {
      title: "Add Vehicle",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}
/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inventoryId);
  let nav = await utilities.getNav();

  const inventoryData = (await invModel.getInventoryByInventoryId(inventory_id))[0]; 
  const classifications = await utilities.buildClassificationList(inventoryData.classification_id);
  const itemName = `${inventoryData.inv_make} ${inventoryData.inv_model}`;

  res.render("./inventory/editInventory", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    classifications,
    inv_id: inventoryData.inv_id,
    inv_make: inventoryData.inv_make,
    inv_model: inventoryData.inv_model,
    inv_year: inventoryData.inv_year,
    inv_description: inventoryData.inv_description,
    inv_image: inventoryData.inv_image,
    inv_thumbnail: inventoryData.inv_thumbnail,
    inv_price: inventoryData.inv_price,
    inv_miles: inventoryData.inv_miles,
    inv_color: inventoryData.inv_color,
    classification_id: inventoryData.classification_id,
  });
};


/* *****************************************************
* Handle post request to update a vehicle to the inventory 
* ****************************************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()

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
  } = req.body

  const updateResult = await invModel.updateInventory(
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
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv")
  } else {
    const classifications = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", `The ${itemName} update failed. Please, try again`)
    res.status(501).render("inventory/editInventory", {
      title: "Edit " + itemName,
      nav,
      errors: null,
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
      classification_id
    })
  }
}

/* Build delete confirmation view*/
invCont.deleteView = async function (req, res, next) {
    const inventory_id = parseInt(req.params.inventoryId);
    let nav = await utilities.getNav()
  
    const inventoryData = (
      await invModel.getInventoryByInventoryId(inventory_id))[0]; 
    const itemName = `${inventoryData.inv_make} ${inventoryData.inv_model}`
  
    res.render("./inventory/deleteConfirmation", {
      title: "Delete " + itemName,
      errors: null,
      nav,
      inv_id: inventoryData.inv_id,
      inv_make: inventoryData.inv_make,
      inv_model: inventoryData.inv_model,
      inv_year: inventoryData.inv_year,
      inv_price: inventoryData.inv_price,
    })
  }

/* Delete Inventory Item*/
invCont.deleteItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inventory_id = parseInt(req.body.inv_id)
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
  } = req.body
  
  const deleteResult = await invModel.deleteInventoryItem(inventory_id)
  const itemName = `${inv_make} ${inv_model}`
  if (deleteResult) {
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv")
  } else {
    req.flash("notice", "Sorry, the delete failed")
    res.status(501).render("inventory/deleteConfirmation", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    })
  }
}

module.exports = invCont