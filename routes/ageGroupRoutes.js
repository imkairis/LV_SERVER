const express = require("express");
const router = express.Router();
const controller = require("../controllers/ageGroupController");
const { isAdmin, isAuthorization } = require("../middlewares/authMiddleware");

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.get("/:id/products", controller.getProductByAgeGroup);

router.get("/admin", isAuthorization, isAdmin, controller.getAll);
router.post("/admin", isAuthorization, isAdmin, controller.createOne);
router.get("/admin/:id", isAuthorization, isAdmin, controller.getOne);
router.put("/admin/:id", isAuthorization, isAdmin, controller.updateOne);
router.delete("/admin/:id", isAuthorization, isAdmin, controller.deleteOne);

module.exports = router;
