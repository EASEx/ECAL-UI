import Store from "electron-store";
import os from "os"
import path from "path"
import { Sequelize } from 'sequelize-typescript';
import Session from "./models/session";



const dbPath = path.join(os.homedir(), 'db.json')

type StoreType = {
    version: string
}

console.log(dbPath)

const confDB = new Store<StoreType>()

console.log(__dirname)

const sequelize = new Sequelize({
    models: [Session],
    dialect: 'sqlite',
    storage: path.join(os.homedir(), 'ecal.sqlite3')
});

const ecalDB = {
    confDB,
    sequelize
}

export default ecalDB