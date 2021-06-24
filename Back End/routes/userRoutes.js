const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

//Profile routes
router
  .route("/:roll")
  .get(userController.mustBeLoggedIn, userController.getUser)
  .patch(userController.mustBeLoggedIn, userController.updateProfile)
  .delete(userController.mustBeLoggedIn, userController.deleteMe);

//Auth routes
router.post("/", userController.signUp);
router.post("/signin", userController.signIn);
router.post("/signout", userController.signOut);
router.post("/forgotpassword", userController.forgotPassword);
router.patch("/resetpassword/:token", userController.resetPassword);

module.exports = router;
