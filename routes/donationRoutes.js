const express = require("express");
const router = express.Router();
const { isAuthorization } = require('../middlewares/authMiddleware');
const donationController = require("../controllers/donationController");

router.get("/", isAuthorization, donationController.getAllDonations);
router.get("/me", isAuthorization, donationController.getAllMyDonations);
router.get("/:id",isAuthorization,  donationController.getDonationDetails);
router.post("/",isAuthorization,  donationController.createDonation);
router.put("/:id",isAuthorization,  donationController.updateDonation);
router.delete("/:id",isAuthorization,  donationController.deleteDonation);
router.post("/:id/register",isAuthorization,  donationController.registerDonation);
router.post("/:id/unregister",isAuthorization,  donationController.unregisterDonation);
router.get("/:id/check-registration",isAuthorization,  donationController.checkRegistration);

module.exports = router;
