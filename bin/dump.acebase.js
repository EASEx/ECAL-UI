const { AceBase } = require("acebase");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;
const fs = require("fs");
const path = require("path");
const os = require("os");

//   if (argv.in && argv.out) {
const aceDB = new AceBase("cryptdb", {
  storage: {
    path: path.join(os.homedir(), "ecal"),
  },
});
aceDB
  .ref("/")
  .get()
  .then((snap) => {
    console.log(JSON.stringify(snap.val(), null, 4));
    fs.writeFileSync("test.json", JSON.stringify(snap.val(), null, 4));
  });
