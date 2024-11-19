const Donation = require("../models/Donation");
const DonationComment = require("../models/DonationComment");
const { getAllDocuments } = require("../utils/querryDocument");

exports.getAllDonations = async (req, res) => {
    const query = {};
    
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: "i" };
    }

    const defaultField = "name"; 
    const populate = ["user", "type"]; 
    getAllDocuments(Donation, query, defaultField, req, res, populate);
};

exports.getAllMyDonations = async (req, res) => {
  const query = {
    user: req.user.id
  };
  if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };
  }

  const defaultField = "name"; 
  const populate = ["user", "type"];
  getAllDocuments(Donation, query, defaultField, req, res, populate);
};

exports.getDonationDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const donation = await Donation.findById(id).populate("user type");

        if (!donation) {
            return res.status(404).json({ error: "Donation not found" });
        }

        res.status(200).json({ data: donation });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

exports.createDonation = async (req, res) => {
    const { user, name, age, historyOfIssue, currentIssue, status, address, description, type, phone } = req.body;

    try {
        const newDonation = new Donation({
            user,
            name,
            age,
            historyOfIssue,
            currentIssue,
            status,
            address,
            type,
            description,
            phone,
        })

        if (req.files?.["images"] && req.files["images"].length > 0) {
            newDonation.images = req.files["images"].map(file => file.filename);
        }
        console.log(req.files.images);

        await newDonation.save();
        res.status(201).json({ data: newDonation });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Cập nhật donation
exports.updateDonation = async (req, res) => {
    try {
        const { id } = req.params;
        const { ...props } = req.body;

        const donation = await Donation.findById(id);

        if (!donation) {
            return res.status(404).json({ error: "Donation not found" });
        }

        for (const key in props) {
            if (donation.hasOwnProperty(key)) {
                donation[key] = props[key] || donation[key];
            }
        }

        if (req.files?.["images"] && req.files["images"].length > 0) {
            const images = req.files["images"].map(file => file.filename);
            donation.images = [...donation.images, ...images];
        }

        await donation.save();
        res.status(200).json({ data: donation });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

exports.deleteDonation = async (req, res) => {
    try {
        const { id } = req.params;

        await Donation.findByIdAndDelete(id);

        res.status(204).send();
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};


exports.getCommentsByDonation = async (req, res) => {
    const { donationId } = req.params;

    try {
        const query = { donation: donationId };
        const defaultField = "createdAt";
        const populate = ["user"];
        getAllDocuments(DonationComment, query, defaultField, req, res, populate);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

exports.addComment = async (req, res) => {
    const { donationId } = req.params;
    const { content } = req.body;

    try {
        const donation = await Donation.findById(donationId);
        if (!donation) {
            return res.status(404).json({ error: "Donation not found" });
        }

        const newComment = new DonationComment({
            user: req.user.id, 
            donation: donationId,
            content,
        });

        await newComment.save();
        res.status(201).json({ data: newComment });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};


exports.updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    try {
        const comment = await DonationComment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (String(comment.user) !== req.user.id) {
            return res.status(403).json({ error: "You are not allowed to edit this comment" });
        }

        comment.content = content;
        await comment.save();

        res.status(200).json({ data: comment });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};


exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await DonationComment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (String(comment.user) !== req.user.id) {
            return res.status(403).json({ error: "You are not allowed to delete this comment" });
        }

        await comment.remove();
        res.status(204).send();
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};