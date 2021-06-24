const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { mustBeLoggedIn, restrict } = require("../controllers/userController");

router.use(mustBeLoggedIn);
router.route("/").get(eventController.allEvents).post(eventController.addEvent);
router
  .route("/:id")
  .post(eventController.validateId, eventController.handleSubmit)
  .get(eventController.validateId, eventController.getEvent)
  .patch(restrict, eventController.validateId, eventController.editEvent)
  .delete(restrict, eventController.validateId, eventController.deleteEvent);
router.get(
  "/stats/:id",
  restrict,
  eventController.validateId,
  eventController.getStats
);
module.exports = router;
