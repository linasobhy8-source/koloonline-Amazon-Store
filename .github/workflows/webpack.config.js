// webpack.config.js
const path = require("path");

module.exports = {
  entry: "./src/index.js", // ملف الـ JS الرئيسي
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public/js"), // الناتج داخل مجلد public
    clean: true,
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"], // لدعم ملفات CSS
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        type: "asset/resource", // لدعم الصور
        generator: {
          filename: "images/[name][ext]",
        },
      },
    ],
  },
};
