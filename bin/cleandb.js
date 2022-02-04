const os = require("os");
const path = require("path");
const fs = require("fs");

try {
  fs.unlinkSync(path.join(os.homedir(), `ecal`, `db.json`));
  fs.unlinkSync(path.join(os.homedir(), `ecal`, `cryptdb.acebase`));
} catch (error) {
  console.error(error);
}
