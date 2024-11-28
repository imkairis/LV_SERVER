const mongoose = require("mongoose");
const Product = require("./models/Product"); // Đường dẫn tới model của bạn

const updateProductStatus = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/your-database-name", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const products = await Product.find();

    for (const product of products) {
      if (product.quantity === 0) {
        product.status = "Hết hàng";
      } else if (product.quantity > 0 && product.quantity <= 10) {
        product.status = "Sắp hết hàng";
      } else {
        product.status = "Còn hàng";
      }
      await product.save();
    }

    console.log("Cập nhật trạng thái sản phẩm thành công!");
    process.exit(0); // Thoát sau khi hoàn tất
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
    process.exit(1);
  }
};

updateProductStatus();
