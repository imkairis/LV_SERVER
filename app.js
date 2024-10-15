const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const os = require("os");

const authRoutes = require("./routes/authRoutes");
const configRoutes = require("./routes/configRoutes");
const typeRoutes = require("./routes/productTypeRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const deliveryStatusRoutes = require("./routes/deliveryStatusRoutes");
const paymentStatusRoutes = require("./routes/paymentStatusRoutes");
const accountRoutes = require("./routes/accountRoutes");
const ageGroupRoutes = require("./routes/ageGroupRoutes");
const targetAudienceRoutes = require("./routes/targetAudienceRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const vnpayRoutes = require("./routes/vnpayRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const postRoutes = require("./routes/postRoutes");

const config = require("./config");
const morgan = require("morgan");
const passport = require("./passport");
const cors = require("cors");

const app = express();
app.use(passport.initialize());

mongoose
    .connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.use(
    cors({
        origin: config.frontEndOrigin, // Replace with your frontend's origin
        methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
        credentials: true, // Enable credentials if needed (for cookies, authentication)
    })
);

const version = "v1";

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(`/${version}/auth`, authRoutes);
app.use(`/${version}/config`, configRoutes);
app.use(`/${version}/types`, typeRoutes);
app.use(`/${version}/payment-methods`, paymentRoutes);
app.use(`/${version}/delivery-methods`, deliveryRoutes);
app.use(`/${version}/delivery-statuses`, deliveryStatusRoutes);
app.use(`/${version}/payment-statuses`, paymentStatusRoutes);
app.use(`/${version}/accounts`, accountRoutes);
app.use(`/${version}/ages`, ageGroupRoutes);
app.use(`/${version}/targets`, targetAudienceRoutes);
app.use(`/${version}/accounts`, accountRoutes);
app.use(`/${version}/products`, productRoutes);
app.use(`/${version}/carts`, cartRoutes);
app.use(`/${version}/orders`, orderRoutes);
app.use(`/${version}/vnpay`, vnpayRoutes);
app.use(`/${version}/feedbacks`, feedbackRoutes);
app.use(`/${version}/posts`, postRoutes);
app.use(`/${version}`, express.static("uploads"));

function getServerIP() {
    const interfaces = os.networkInterfaces();
    for (const iface in interfaces) {
        for (const alias of interfaces[iface]) {
            if (alias.family === "IPv4" && !alias.internal) {
                return alias.address;
            }
        }
    }
    return "localhost";
}

const [host, port] = (process.argv[2] || "0.0.0.0:5000").split(":");

const server = app.listen(port, host, () => {
    const serverIP = getServerIP();
    console.log(`Server running at http://${serverIP}:${port}/${version}`);
});
