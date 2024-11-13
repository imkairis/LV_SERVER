const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/User");

exports.isAuthorization = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token)
        return res
            .status(401)
            .json({ error: "No token, authorization denied" });
    console.log(token);
    try {
        const decoded = jwt.verify(token, config.secretKey);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ error: "Token is not valid" });
    }
};

exports.isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!user.isAdmin) {
            return res.status(403).json({ error: "Access denied, admin only" });
        }

        next();
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};
