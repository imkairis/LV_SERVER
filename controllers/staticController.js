const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

const today = new Date();
const firstDayInMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const getDateFromToday = (days) => {
    const day = new Date();
    return new Date(day.setDate(day.getDate() + days));
};

// const getProductStatistics = async () => {
//     return await Product.aggregate([
//         {
//             $lookup: {
//                 from: "orders", // the collection name for 'Order'
//                 localField: "_id",
//                 foreignField: "items.product", // match `items.product` in `Order` with `_id` in `Book`
//                 as: "orders",
//             },
//         },
//         { $unwind: "$orders" }, // Unwind orders array
//         { $unwind: "$orders.items" }, // Further unwind the items array
//         {
//             $match: {
//                 "orders.items.product": { $exists: true }, // ensures that we only care about items with a product
//                 "orders.createdAt": { $gte: firstDayInMonth }, // filter by date
//             },
//         },
//         {
//             $group: {

//         }
//         // {
//         //     $addFields: {
//         //         soldQuantity: { $sum: "$orders.items.quantity" },
//         //         // revenue: { $sum: { $multiply: ["$price", "$orders.items.quantity"] } },
//         //         // cost: { $sum: { $multiply: ["$cost", "$orders.items.quantity"] } },
//         //         totalPice: { $sum: { $multiply: ["$price", "$orders.items.quantity"] } },
//         //     },
//         // },
//         // {
//         //     $project: {
//         //         name: 1,
//         //         stockQuantity: 1,
//         //         soldQuantity: 1,
//         //         totalPice: 1,
//         //     },
//         // },
//     ]);
// };

const getCountNewProduct = async () => {
    return await Product.countDocuments({ createdAt: { $gte: firstDayInMonth } });
};

const getCountNewOrderSuccess = async () => {
    return await Order.countDocuments({ deliveryStatus: "delivered", createdAt: { $gte: firstDayInMonth } });
}

// số sản phẩm gần hết hạn từ hôm nay đến 30 ngày sau
const getCountProductNearlyExpired = async () => {
    const todayInside = new Date();
    const numberOfDaysToAdd = 30;
    const thirtyDaysFromNow = getDateFromToday(numberOfDaysToAdd);

    return await Product.countDocuments({ expirationDate: { $gte: today, $lte: thirtyDaysFromNow } });
}

const getCountProducts = async () => {
    return await Product.countDocuments();
};

const getCountUser = async () => {
    return await User.countDocuments({ isAdmin: false });
};

const getProductSell = async () => {
    const res = await Order.aggregate([
        {
            $match: {
                deliveryStatus: "delivered",
                createdAt: { $gte: firstDayInMonth },
            },
        },
        { $unwind: "$items" },
        {
            $group: {
                _id: "$items.product",
                soldQuantity: { $sum: "$items.quantity" },
                revenue: { $sum: { $multiply: ["$items.totalPrice", "$items.quantity"] } },
            },
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "product",
            },
        },
        { $unwind: "$product" },
        {
            $project: {
                _id: 0,
                name: "$product.name",
                soldQuantity: 1,
                revenue: 1,
            },
        },
    ]);

    console.log(res);

    return [];
};

// await Product.aggregate([
//     {
//         $lookup: {
//             from: "orderitems",
//             localField: "_id",
//             foreignField: "product",
//             as: "orderItems",
//         },
//     },
//     {
//         $addFields: {
//             soldQuantity: { $sum: "$orderItems.quantity" },
//             revenue: { $sum: { $multiply: ["$price", "$orderItems.quantity"] } },
//         },
//     },
//     {
//         $group: {
//             _id: "$_id",
//             name: { $first: "$name" },
//             soldQuantity: { $sum: "$soldQuantity" },
//             revenue: { $sum: "$revenue" },
//             stockQuantity: { $sum: "$stockQuantity" },
//         },
//     },
// ])

// Thống kê doanh thu, số lượng bán ra theo loại sản phẩm
// const getTypeStatistics = async () => {
//   return await ProductType.aggregate([
//     {
//       $lookup: {
//         from: "books",
//         localField: "_id",
//         foreignField: "type",
//         as: "books",
//       },
//     },
//     {$unwind: "$books"},
//     {
//       $lookup: {
//         from: "orderitems",
//         localField: "books._id",
//         foreignField: "product",
//         as: "orderItems",
//       },
//     },
//     {
//       $addFields: {
//         soldQuantity: {$sum: "$orderItems.quantity"},
//         revenue: {$sum: {$multiply: ["$books.price", {$sum: "$orderItems.quantity"}]}},
//       },
//     },
//     {
//       $group: {
//         _id: "$_id",
//         name: {$first: "$name"},
//         soldQuantity: {$sum: "$soldQuantity"},
//         revenue: {$sum: "$revenue"},
//         stockQuantity: {$sum: "$books.stockQuantity"},
//       },
//     },
//   ]);
// };

// const getTypeStatistics = async () => {
//     return await ProductType.aggregate([
//         {
//             $lookup: {
//                 from: "books",
//                 localField: "_id",
//                 foreignField: "type",
//                 as: "books",
//             },
//         },
//         { $unwind: "$books" },
//         {
//             $lookup: {
//                 from: "orders",
//                 localField: "books._id",
//                 foreignField: "items.product",
//                 as: "orderItems",
//             },
//         },
//         { $unwind: "$orderItems" }, // Unwind OrderItem for proper aggregation
//         {
//             $addFields: {
//                 soldQuantity: { $sum: "$orderItems.items.quantity" }, // correct multiplication of
//                 revenue: {
//                     $sum: { $multiply: ["$books.price", "$soldQuantity"] }, // revenue logic
//                 },
//             },
//         },
//         {
//             $group: {
//                 _id: "$_id",
//                 name: { $first: "$name" },
//                 soldQuantity: { $sum: "soldQuantity" }, //
//                 revenue: { $sum: "revenue" }, // sum aggregated per unique type
//                 stockQuantity: { $sum: "$books.stockQuantity" },
//             },
//         },
//     ]);
// };


// Thống kê doanh thu, số lượng bán ra theo tác giả
// const getAuthorStatistics = async () => {
//     return await Product.aggregate([
//         {
//             $lookup: {
//                 from: "orderitems",
//                 localField: "_id",
//                 foreignField: "product",
//                 as: "orderItems",
//             },
//         },
//         {
//             $addFields: {
//                 soldQuantity: { $sum: "$orderItems.quantity" },
//                 revenue: { $sum: { $multiply: ["$product.price", "$orderItems.quantity"] } },
//             },
//         },
//         {
//             $lookup: {
//                 from: "authors",
//                 localField: "author",
//                 foreignField: "_id",
//                 as: "author",
//             },
//         },
//         { $unwind: "$author" },
//         {
//             $group: {
//                 _id: "$author._id",
//                 name: { $first: "$author.fullname" },
//                 soldQuantity: { $sum: "$soldQuantity" },
//                 revenue: { $sum: "$revenue" },
//                 stockQuantity: { $sum: "$stockQuantity" },
//             },
//         },
//     ]);
// };
//
// const getAuthorStatistics = async () => {
//   return await Book.aggregate([
//     {
//       $lookup: {
//         from: "orders",
//         localField: "_id",
//         foreignField: "items.product", // Check proper orderitem level is foreignField
//         as: "orderItems",
//       },
//     },
//     {$unwind: "$orderItems"}, // Allow nested orders unfold per book.
//     {
//       $addFields: {
//         soldQuantity: {$sum: "$orderItems.items.quantity"},
//         revenue: {
//           $sum: {$multiply: ["$price", "$orderItems.items.quantity"]},
//         },
//       },
//     },
//     {
//       $lookup: {
//         from: "authors",
//         localField: "author",
//         foreignField: "_id",
//         as: "author",
//       },
//     },
//     {$unwind: "$author"},
//     {
//       $group: {
//         _id: "$author._id",
//         name: {$first: "$author.fullname"},
//         soldQuantity: {$sum: "$soldQuantity"},
//         revenue: {$sum: "$revenue"},
//         stockQuantity: {$sum: "$stockQuantity"},
//       },
//     },
//   ]);
// };
//

// Thống kê doanh thu, số lượng bán ra theo nhà xuất bản
// const getPublisherStatistics = async () => {
//   return await Publisher.aggregate([
//     {
//       $lookup: {
//         from: "books",
//         localField: "_id",
//         foreignField: "publisher",
//         as: "books",
//       },
//     },
//     {$unwind: "$books"},
//     {
//       $lookup: {
//         from: "orderitems",
//         localField: "books._id",
//         foreignField: "product",
//         as: "orderItems",
//       },
//     },
//     {
//       $addFields: {
//         soldQuantity: {$sum: "$orderItems.quantity"},
//         revenue: {$sum: {$multiply: ["$books.price", {$sum: "$orderItems.quantity"}]}},
//       },
//     },
//     {
//       $group: {
//         _id: "$_id",
//         name: {$first: "$name"},
//         soldQuantity: {$sum: "$soldQuantity"},
//         revenue: {$sum: "$revenue"},
//         stockQuantity: {$sum: "$books.stockQuantity"},
//       },
//     },
//   ]);
// };

// const getPublisherStatistics = async () => {
//     return await Publisher.aggregate([
//         {
//             $lookup: {
//                 from: "books",
//                 localField: "_id",
//                 foreignField: "publisher",
//                 as: "books",
//             },
//         },
//         { $unwind: "$books" },
//         {
//             $lookup: {
//                 from: "orders", // Lookup from orders as orderItems are embedded here
//                 localField: "books._id",
//                 foreignField: "items.product",
//                 as: "orderItems",
//             },
//         },
//         { $unwind: "$orderItems" },
//         { $unwind: "$orderItems.items" },
//         {
//             $addFields: {
//                 soldQuantity: "$orderItems.items.quantity",
//                 revenue: {
//                     $multiply: ["$books.price", "$orderItems.items.quantity"],
//                 },
//             },
//         },
//         {
//             $group: {
//                 _id: "$_id",
//                 name: { $first: "$name" },
//                 totalSoldQuantity: { $sum: "$soldQuantity" },
//                 totalRevenue: { $sum: "$revenue" },
//                 stockQuantity: { $sum: "$books.stockQuantity" },
//             },
//         },
//     ]);
// };


// Controller chính để gọi các hàm thống kê và trả về kết quả tổng hợp
const getStatistics = async (req, res) => {
    try {
        const countNewProduct = await getCountNewProduct();
        const countNewOrderSuccess = await getCountNewOrderSuccess();
        const countProductNearlyExpired = await getCountProductNearlyExpired();
        const countProducts = await getCountProducts();
        const countUser = await getCountUser();

        res.status(200).json({
            countNewProduct,
            countNewOrderSuccess,
            countProductNearlyExpired,
            countProducts,
            countUser,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getStatistics,
};