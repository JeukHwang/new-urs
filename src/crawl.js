import axios from "axios";
import dotenv from "dotenv";
import { parse } from 'node-html-parser';
import * as fs from 'node:fs/promises';
import { reserve_resource_url, search_url } from "./url.js";

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

async function get_location_in_page(page) {
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
        const nameElem = item.querySelector("p > a");
        const href = nameElem.getAttribute("href");
        const isLibitUrl = href == "#";
        if (isLibitUrl) {
            await fs.writeFile("./data/tmp/warn_libit.json", nameElem.outerHTML + "\n", { flag: "a" });
        }
        const id = isLibitUrl ? "0000000000" : href.match(/prgrId=(\d+)/)[1];
        const name = nameElem.innerText.trim();
        const [description, resourceDescription, type, manager, date] = item.querySelectorAll("dl > dd").map((dd) => dd.innerText.trim());
        const tag = type.split(",").filter((t) => t !== "");
        return { name, description, resourceDescription, tag, manager, registeredDate: date, id };
    }));
    return search_JSON;
}

async function get_all_location() {
    const maxPageNum = await getMaxPageNum();
    const pageList = Array.from({ length: maxPageNum }, (_, i) => i + 1);
    const searchResultList = await Promise.all(pageList.map(get_location_in_page));
    const searchResult = [].concat(...searchResultList);
    return searchResult;
}

async function get_resource_in_location(locationId) {
    const formData = new URLSearchParams();
    formData.append("prgrId", locationId);
    const content = await axios.post(reserve_resource_url, formData, {
        headers: { Cookie: process.env.COOKIE }
    });
    const html = content.data;
    await validateLogin(html);

    const root = parse(html);
    const search_JSON = root.querySelectorAll(".table_list > tbody > tr").map((item) => {
        const resourceId = item.querySelector("td > input").getAttribute("value");
        const [_, name, location, buildingNumber, floor, room, capacity, equipment] = item.querySelectorAll("td").map((td) => td.innerText.trim());
        return { name, location, buildingNumber, floor, room, capacity, equipment, resourceId, locationId };
    });
    return search_JSON;
}

async function get_all_resource() {
    const location = await fs.readFile("./data/location.json", "utf-8");
    const location_JSON = JSON.parse(location);
    const locationIdList = location_JSON.map((item) => item.id);
    const resourceList = await Promise.all(locationIdList.map(get_resource_in_location));
    const resource = [].concat(...resourceList);
    return resource;
}

async function main() {
    await initDir();

    // Update location and save into ./data/location.json
    // const searchResult = await get_all_location();
    // const pretty_JSON_string = JSON.stringify(searchResult, null, 2);
    // await fs.writeFile("./data/location.json", pretty_JSON_string);
    // console.log(searchResult.length); // 77

    // Update resource and save into ./data/resource.json
    const resource = await get_all_resource();
    const pretty_JSON_string = JSON.stringify(resource, null, 2);
    await fs.writeFile("./data/resource.json", pretty_JSON_string);
    console.log(resource.length); // 173

    // get_resource_in_location("0000000501");
}

main();
