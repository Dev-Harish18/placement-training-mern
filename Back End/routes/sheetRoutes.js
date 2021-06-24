const express = require("express");
const router = express.Router();
const sheetController = require("../controllers/sheetController");
const userController = require("../controllers/userController");

router.use(userController.mustBeLoggedIn, sheetController.initSheet);
router
  .route("/")
  .get(sheetController.getSheetData)
  .post(userController.restrict, sheetController.updateSheetData);
router.post("/filter", sheetController.filterSheetData);

module.exports = router;
