const Product = require("../models/Product");
const { deleteFile } = require("../utils/deleteFile");
const { getAllDocuments } = require("../utils/querryDocument");

exports.getAll = async (req, res) => {
    let query = {};
    let populate = [];

    if (req.query.type) {
        query = { ...query, type: req.query.type };
    }
    if (req.query.ageGroup) {
        query = { ...query, ageGroup: req.query.ageGroup };
    }
    if (req.query.targets) {
        query = { ...query, targetAudience: req.query.targets };
    }
    if (req.query.populate) {
        populate = req.query.populate.split(",");
    }
    if (req.query.status) {
        query = { ...query, status: req.query.status };
    }
    if (req.query.price) {
        const [min, max] = req.query.price.split("-");
        query = { ...query, price: { $gte: min, $lte: max } };
    }

    if (req.query.search) {
        query = {
            ...query,
            // name: { $regex: req.query.search, $options: "i" },
            $text: { $search: req.query.search, $diacriticSensitive: true },
        };
    }

    const defaultField = "name";
    const enableSearchScore = true;

    getAllDocuments(Product, query, defaultField, req, res, populate);
};

exports.getOne = async (req, res) => {
    try {
        const id = req.params.id;
        const populate = req.query.populate
            ? req.query.populate.split(",")
            : [];

        const object = await Product.findById(id).populate(populate);

        res.status(200).json({
            data: object,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const {
            name,
            price,
            type,
            quantity,

            description,
            userManual,
            weight,
            element,
            origin,
            dateOfManufacture,
            expirationDate,
            targetAudience,
            ageGroup,
        } = req.body;

        const object = new Product({
            name,
            price,
            quantity,
            type,

            description,
            userManual,
            weight,
            element,
            origin,
            dateOfManufacture,
            expirationDate,
            targetAudience,
            ageGroup,
        });

        if (req.files?.["images"] && req.files["images"].length > 0) {
            object.images = req.files["images"].map(file => file.filename);
        }

        await object.save();
        res.status(201).json({ data: object });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            name,
            price,
            quantity,

            type,

            description,
            userManual,
            weight,
            element,
            origin,
            dateOfManufacture,
            expirationDate,
            targetAudience,
            ageGroup,
        } = req.body;

        const object = await Product.findById(id);

        if (!object) {
            return res.status(404).json({ error: "Not found" });
        }

        object.name = name || object.name;
        object.price = price || object.price;
        object.quantity = quantity || object.quantity;


        object.description = description || object.description;
        object.userManual = userManual || object.userManual;
        object.weight = weight || object.weight;
        object.element = element || object.element;
        object.origin = origin || object.origin;
        object.dateOfManufacture =
            dateOfManufacture || object.dateOfManufacture;
        object.expirationDate = expirationDate || object.expirationDate;
        object.targetAudience = targetAudience || object.targetAudience;
        object.ageGroup = ageGroup || object.ageGroup;
        object.type = type || object.type;

        if (req.files?.["images"] && req.files["images"].length > 0) {
            const images = req.files["images"].map(file => file.filename);
            object.images = [...object.images, ...images];
        }

        await object.save();
        res.status(200).json({ data: object });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteOne = async (req, res) => {
    try {
        const id = req.params.id;
        const object = await Product.findByIdAndDelete(id);

        if (!object) {
            return res.status(404).json({ error: "Not found" });
        }

        object.images.forEach(file => {
            deleteFile(file, res);
        });

        res.status(204).send();
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteImage = async (req, res) => {
    const { id, image } = req.params;

    try {
        let product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: "Not found" });
        }

        if (!product.images.includes(image)) {
            return res.status(404).json({ error: "Not found" });
        }

        deleteFile(image, res);

        product.images = product.images.filter(i => i !== image);
        await product.save();

        res.json({ data: product });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};
