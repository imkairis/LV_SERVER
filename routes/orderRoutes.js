const express = require("express");
const { isAuthorization, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();
const controller = require("../controllers/orderController");

router.get("/", isAuthorization, controller.getAllBySelf);
router.get("/admin", isAuthorization, isAdmin, controller.getAllByAdmin);
router.get("/order-detail/:id", isAuthorization, controller.getById);
router.post("/", isAuthorization, controller.createOne);
router.put("/admin/:id", isAuthorization, controller.updateDeliveryStatus);
router.put("/cancel/:id", isAuthorization, controller.cancelOrder);
router.put("/mark-as-delivered/:id", isAuthorization, controller.markAsDelivered);
router.put("/:id", isAuthorization, controller.updateDeliveryStatus);
module.exports = router;
