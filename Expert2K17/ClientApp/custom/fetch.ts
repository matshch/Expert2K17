import { fetch as oldFetch } from "domain-task";

let cookie : string = null;

export function fetch(url: string | Request, init?: RequestInit): Promise<any> {
    if (cookie === null) {
        return oldFetch(url, init);
    }
    if (init == undefined || init == null) {
        init = {};
    }
    if (init.headers == undefined || init.headers == null) {
        init.headers = {};
    }
    init.headers["Cookie"] = cookie;
    return oldFetch(url, init);
}

export { addTask, baseUrl, run } from "domain-task";

export default function fetchPatch(allCookies: string) {
    cookie = allCookies;
}
