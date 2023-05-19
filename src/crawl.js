import axios from "axios";
import dotenv from "dotenv";
import { parse } from 'node-html-parser';
import * as fs from 'node:fs/promises';
import { search_url } from "./url.js";

dotenv.config();

async function initDir() {
    await fs.mkdir("./data/tmp", { recursive: true });
}

async function validateLogin(html) {
    await fs.writeFile("./data/tmp/verbose_validate_html.txt", html);
    const isNotLogined = await html.includes("서비스 이용을 위해서 로그인을 해주시기 바랍니다.");
    if (isNotLogined) {
        await fs.writeFile("./data/tmp/error_login.txt", html + "\n");
        throw "Axios Error: Login Required";
    }
}

async function getMaxPageNum() {
    const formData = new URLSearchParams();
    formData.append("pageIndex", 1);
    const content = await axios.post(search_url, formData, {
        headers: { Cookie: process.env.COOKIE }
    });
    const html = content.data;
    await validateLogin(html);

    const root = parse(html);
    const last_paging_button = root.querySelector("#page_num > ul > a:last-child");
    const maxPageNum = last_paging_button.getAttribute("onclick").match(/fn_link_page\((\d+)\)/);
    return maxPageNum[1];
}

async function get_resource_in_page(page) {
    const formData = new URLSearchParams();
    formData.append("pageIndex", page);
    const content = await axios.post(search_url, formData, {
        headers: { Cookie: process.env.COOKIE }
    });
    const html = content.data;
    await validateLogin(html);

    const root = parse(html);
    const search_elem = root.querySelectorAll(".srch_list");
    const search_JSON = await Promise.all(search_elem.map(async (item) => {
        const titleElem = item.querySelector("p > a");
        const href = titleElem.getAttribute("href");
        const isLibitUrl = href == "#";
        if (isLibitUrl) {
            await fs.writeFile("./data/tmp/warn_libit.json", titleElem.outerHTML + "\n", { flag: "a" });
        }
        const prgrId = isLibitUrl ? "0000000000" : href.match(/prgrId=(\d+)/)[1];
        const title = titleElem.innerText.trim();
        const [description, resource, type, manager, date] = item.querySelectorAll("dl > dd").map((dd) => dd.innerText.trim());
        const tag = type.split(",").filter((t) => t !== "");
        return { title, description, resource, tag, manager, registeredDate: date, prgrId };
    }));
    return search_JSON;
}

async function main() {
    await initDir();
    const maxPageNum = await getMaxPageNum();
    const pageList = Array.from({ length: maxPageNum }, (_, i) => i + 1);
    const searchResultList = await Promise.all(pageList.map(get_resource_in_page));
    const searchResult = [].concat(...searchResultList);
    const pretty_JSON_string = JSON.stringify(searchResult, null, 2);
    await fs.writeFile("./data/resource.json", pretty_JSON_string);
}

main();
