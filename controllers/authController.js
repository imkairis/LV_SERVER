const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const config = require("../config");
const User = require("../models/User");
const Cart = require("../models/Cart");

const transporter = nodemailer.createTransport({
    service: config.emailService,
    auth: {
        user: config.emailUser,
        pass: config.emailPass,
    },
});

exports.register = async (req, res) => {
    const { username, fullname, birthday, phone, address, email, password } =
        req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }

        user = new User({
            username,
            fullname,
            birthday,
            phone,
            address,
            email,
            password,
            isAdmin: false,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const cart = new Cart({
            user: user.id,
        });

        await cart.save();

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            config.secretKey,
            { expiresIn: config.expiresIn },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            config.secretKey,
            { expiresIn: config.expiresIn },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { ...user._doc, password: "" } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.updateUser = async (req, res) => {
    const { username, fullname, birthday, phone, address, email, newPassword } =
        req.body;

    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        if (username) user.username = username;
        if (fullname) user.fullname = fullname;
        if (birthday) user.birthday = birthday;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (email) user.email = email;

        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if (req.files?.["avatar"]) {
            user.avatar = req.files?.["avatar"][0].filename;
        }

        if (req.files?.["photos"] && req.files?.["photos"].length > 0) {
            const photos = req.files?.["photos"].map(file => file.filename);
            user.photos = [...user.photos, ...photos];
        }

        await user.save();
        res.json({ data: user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.status(204).end();
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const token = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        const mailOptions = {
            to: email,
            from: config.emailUser,
            subject: "Password Reset",
            text:
                `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                `http://${req.headers.host}/reset/${token}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error("There was an error: ", err);
                res.status(500).send("Error sending email");
            } else {
                res.status(200).json({ msg: "Recovery email sent" });
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res
                .status(400)
                .json({
                    msg: "Password reset token is invalid or has expired",
                });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        res.json({ msg: "Password reset successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.deletePhoto = async (req, res) => {
    const { photo } = req.params;

    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!user.photos.includes(photo)) {
            return res.status(404).json({ error: "Photo not found" });
        }

        const filePath = path.join(__dirname, "..", "uploads", photo);
        fs.unlink(filePath, err => {
            if (err) {
                console.error(err.message);
                return res
                    .status(500)
                    .json({ error: "Failed to delete photo" });
            }
        });

        user.photos = user.photos.filter(p => p !== photo);
        await user.save();

        res.json({ data: user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.getInfo = async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.json({ data: user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.googleCallback = async (req, res) => {
    let user = await User.findById(req.user.user.id);
    if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
    }

    const payload = {
        user: {
            id: user.id,
        },
    };

    jwt.sign(
        payload,
        config.secretKey,
        { expiresIn: config.expiresIn },
        (err, token) => {
            if (err) throw err;
            res.json({ token });
        }
    );
};

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Current password is incorrect" });
        }


        if (newPassword !== confirmPassword) {
            return res.status(400).json({ msg: "New passwords do not match" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ msg: "Password updated successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};
