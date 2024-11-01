const express = require("express");
const router = express.Router();
const controller = require("../controllers/targetAudienceController");
const { isAdmin, isAuthorization } = require("../middlewares/authMiddleware");

router.get("/", controller.getAll);
router.get("/admin", isAuthorization, isAdmin, controller.getAll);
router.post("/admin", isAuthorization, isAdmin, controller.createOne);
router.get("/admin/:id", isAuthorization, isAdmin, controller.getOne);
router.put("/admin/:id", isAuthorization, isAdmin, controller.updateOne);
router.delete("/admin/:id", isAuthorization, isAdmin, controller.deleteOne);
router.get("/:id", controller.getOne);
router.get("/:id/products", controller.getProductByTargetAudience);

module.exports = router;
