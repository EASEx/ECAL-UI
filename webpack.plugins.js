const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const uglifyJsContents = require("uglify-js");
const path = require("path");
module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new CopyPlugin({
    patterns: [
      {
        from: path.join(__dirname, "src/scripts"),
        to: path.join(__dirname, ".webpack/main/scripts"),
        transform: function (fileContent, _) {
          return uglifyJsContents
            .minify(fileContent.toString())
            .code.toString();
        },
      },
    ],
  }),
];
