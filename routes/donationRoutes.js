const express = require("express");
const router = express.Router();
const { isAuthorization } = require('../middlewares/authMiddleware');
const donationController = require("../controllers/donationController");
const {uploadFields} = require('../middlewares/fileMiddleware')


router.get("/", isAuthorization, donationController.getAllDonations);
router.get("/me", isAuthorization, donationController.getAllMyDonations);
router.get("/:id",isAuthorization,  donationController.getDonationDetails);
router.post("/",isAuthorization,uploadFields([
  {
    name: 'images',
    maxCount: 10
  }, 
]), donationController.createDonation);
router.put("/:id",isAuthorization, uploadFields([
  {
    name: 'images',
    maxCount: 10
  }, 
]), donationController.updateDonation);
router.delete("/:id",isAuthorization,  donationController.deleteDonation);

router.get("/:donationId/comments", donationController.getCommentsByDonation);
router.post("/:donationId/comments", isAuthorization, donationController.addComment);
router.put("/comments/:commentId", isAuthorization, donationController.updateComment);
router.delete("/comments/:commentId", isAuthorization, donationController.deleteComment);

module.exports = router;
