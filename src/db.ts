import { AceBase } from "acebase";
import { app } from "electron";
import Store from "electron-store";
import { existsSync, mkdirSync } from "fs";
import MetricNode from ".//models/session";
import os from "os";
import path from "path";

const openDatabases = () => {
  if (!existsSync(path.join(os.homedir(), "ecal"))) {
    mkdirSync(path.join(os.homedir(), "ecal"), { recursive: true });
  }
  const dbPath = path.join(os.homedir(), "ecal", "db.json");

  type StoreType = {
    version: string;
  };

  console.log(process.cwd());

  const confDB = new Store<StoreType>({
    name: dbPath,
    defaults: {
      version: app.getVersion(),
    },
  });

  const aceDB = new AceBase("cryptdb", {
    storage: {
      path: path.join(os.homedir(), "ecal"),
    },
  });

  // aceDB.types.bind("tests/*/sessions/*/metrics/*", MetricNode, {
  //   creator: MetricNode.deserialize,
  //   serializer: MetricNode.prototype.serialize,
  // });

  // aceDB.ref("tests/507f1f77bcf86cd799439011/sessions/abcd/metrics").push({});

  // aceDB
  //   .ref("tests/kz6ugenn0000j8e81k9acvl6/sessions/kz6ujj2a00003se8brg4gyrm")
  //   .get()
  //   .then((snap) => {
  //     console.log(snap.val());
  //   });

  return {
    confDB,
    aceDB,
  };
};

const ecalDB = openDatabases();

export default ecalDB;
