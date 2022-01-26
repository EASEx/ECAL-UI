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

const CURRENT_ACTION = atom<string>({
    key: 'CURRENT_ACTION',
    default: ""
})

export { URLS, ROUTE, CURRENT_ACTION }