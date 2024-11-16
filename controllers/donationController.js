const Donation = require("../models/Donation");
const { getAllDocuments } = require("../utils/querryDocument");

// Lấy danh sách donation
exports.getAllDonations = async (req, res) => {
    const query = {};
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: "i" };
    }

    const defaultField = "name"; // Sắp xếp mặc định theo tên
    const populate = ["user", "registrants"]; // Populates các tham chiếu liên quan
    getAllDocuments(Donation, query, defaultField, req, res, populate);
};

exports.getAllMyDonations = async (req, res) => {
  const query = {
    user: req.user.id
  };
  if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };
  }

  const defaultField = "name"; // Sắp xếp mặc định theo tên
  const populate = ["user", "registrants"]; // Populates các tham chiếu liên quan
  getAllDocuments(Donation, query, defaultField, req, res, populate);
};

// Lấy chi tiết donation
exports.getDonationDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const donation = await Donation.findById(id).populate("user registrants");

        if (!donation) {
            return res.status(404).json({ error: "Donation not found" });
        }

        res.status(200).json({ data: donation });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Tạo mới donation
exports.createDonation = async (req, res) => {
    const { user, name, age, historyOfIssue, currentIssue, status, address } = req.body;
    console.log(req);
    try {
        const newDonation = new Donation({
            user,
            name,
            age,
            historyOfIssue,
            currentIssue,
            status,
            address,
            registrants: [],
        });
    

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
                donation[key] = props[key];
            }
        }

        await donation.save();
        res.status(200).json({ data: donation });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Xóa donation
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

// Đăng ký nhận
exports.registerDonation = async (req, res) => {
  try {
      const { id } = req.params;
      const userId = req.user.id;

      const donation = await Donation.findById(id);

      if (!donation) {
          return res.status(404).json({ error: "Donation not found" });
      }

      // Kiểm tra nếu user đã tồn tại trong mảng `registrants`
      if (donation.registrants.includes(userId)) {
          return res.status(200).json({ message: "Already registered", data: donation });
      }

      // Thêm user vào mảng `registrants`
      donation.registrants.push(userId);

      await donation.save();
      res.status(200).json({ message: "Registered successfully", data: donation });
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server error" });
  }
};

// Hủy đăng ký nhận
exports.unregisterDonation = async (req, res) => {
  try {
      const { id } = req.params;
      const userId = req.user.id;

      const donation = await Donation.findById(id);

      if (!donation) {
          return res.status(404).json({ error: "Donation not found" });
      }

      // Kiểm tra nếu user không tồn tại trong mảng `registrants`
      if (!donation.registrants.includes(userId)) {
          return res.status(200).json({ message: "Not registered", data: donation });
      }

      // Xóa user khỏi mảng `registrants`
      donation.registrants = donation.registrants.filter(
          (registrant) => registrant.toString() !== userId
      );

      await donation.save();
      res.status(200).json({ message: "Unregistered successfully", data: donation });
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server error" });
  }
};


// Kiểm tra đăng ký của bản thân
exports.checkRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const donation = await Donation.findById(id);

        if (!donation) {
            return res.status(404).json({ error: "Donation not found" });
        }

        const isRegistered = donation.registrants.includes(userId);

        res.status(200).json({ data: { isRegistered } });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};
