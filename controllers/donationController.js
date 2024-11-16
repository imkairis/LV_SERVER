const Donation = require("../models/Donation");
const { getAllDocuments } = require("../utils/queryDocument");

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
    const { user, name, age, historyOfIssue, currentIssue, status, address, description, type } = req.body;

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
            description
        })

        if (req.files?.["images"] && req.files["images"].length > 0) {
            newDonation.images = req.files["images"].map(file => file.filename);
        }

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

