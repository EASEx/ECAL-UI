const fs = require("fs");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const path = require("path");
const uglifyJsContents = require("uglify-js");

const argv = yargs(hideBin(process.argv)).argv;

if (argv.dir && argv.out) {
  console.log("Bundling Scripts....");
  const files = fs.readdirSync(argv.dir);
  var bundle = [];
  files.forEach((file) => {
    var script = fs.readFileSync(path.join(argv.dir, file), "utf-8");
    bundle.push(
      `export const ${file
        .replace(".js", "")
        .toUpperCase()}_SCRIPT = ${JSON.stringify(
        uglifyJsContents.minify(script).code.toString()
      )}`
    );
  });
  fs.writeFileSync(argv.out, bundle.join("\n\n"));
}
