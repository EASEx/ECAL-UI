import { atom } from "recoil";

const URLS = atom({
    key: 'URLS',
    default: {
        serverURL: "",
        nbURL: ""
    }
})

const ROUTE = atom<'/' | '/bot'>({
    key: 'ROUTE',
    default: '/'
})

export { URLS, ROUTE }