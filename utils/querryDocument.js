// const { query } = require("express");
const { ceil } = Math;

exports.getAllDocuments = async (
    Model,
    query,
    field,
    req,
    res,
    populate = []
) => {
    try {
        const {
            page = 1,
            limit = 5,
            orderBy = field,
            descending = true,
        } = req.query;

        const sort = {};
        sort[orderBy] = descending === "true" ? -1 : 1;

        const skip = (page - 1) * parseInt(limit, 10);
        const limitInt = Math.max(parseInt(limit, 10), 1);

        const totalItems = await Model.countDocuments(query);

        let objectsQuery = Model.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limitInt);

        if (Array.isArray(populate)) {
            populate.forEach(pop => {
                objectsQuery = objectsQuery.populate(pop);
            });
        } else if (typeof populate === "string") {
            objectsQuery = objectsQuery.populate(populate);
        }

        const objects = await objectsQuery.exec();

        const totalPage = Math.ceil(totalItems / limitInt);

        res.json({
            data: objects,
            pagination: {
                totalItems,
                totalPageItems: objects.length,
                totalPage,
                page: parseInt(page, 10),
                limit: limitInt,
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
};
