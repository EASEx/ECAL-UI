import Store from "electron-store";

type StoreType = {
    version: string
}

const db = new Store<StoreType>()

export default db