const Product = require("../models/Product");
const { deleteFile } = require("../utils/deleteFile");
const { getAllDocuments } = require("../utils/querryDocument");

exports.getAll = async (req, res) => {
    let query = {};

    if (req.query.type) {
        query = { ...query, type: req.query.type };
    }
    if (req.query.ageGroup) {
        query = { ...query, ageGroup: req.query.ageGroup };
    }
    if (req.query.targets) {
        query = { ...query, targetAudience: req.query.targets };
    }

    if (req.query.search) {
        query = {
            ...query,
            $text: { $search: new RegExp(req.query.search, "i") },
        };
    }

    const defaultField = "name";
    getAllDocuments(Product, query, defaultField, req, res);
};

exports.getOne = async (req, res) => {
    try {
        const id = req.params.id;

        const object = await Product.findById(id);

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
            cost,
            stockQuantity,
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
            cost,
            stockQuantity,
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
            cost,
            type,
            stockQuantity,
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
        object.cost = cost || object.cost;
        object.stockQuantity = stockQuantity || object.stockQuantity;
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

        object.images.forEach(file => {
            deleteFile(file, res);
        });

        if (object.file) {
            deleteFile(object.file, res);
        }

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
