import Store from "electron-store";
import os from "os"
import path from "path"


const dbPath = path.join(os.homedir(), 'db.json')

type StoreType = {
    version: string
}

console.log(dbPath)

const confDB = new Store<StoreType>()


const ecalDB = {
    confDB,
}

export default ecalDB