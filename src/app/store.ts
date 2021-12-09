import { atom } from "recoil";

const URLS = atom({
    key: 'URLS',
    default: {
        serverURL: "",
        nbURL: ""
    }
})