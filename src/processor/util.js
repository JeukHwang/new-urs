import * as fs from "fs";

export const get_locations = () => JSON.parse(fs.readFileSync("./data/location.json", "utf-8"));
export const get_resources = () => JSON.parse(fs.readFileSync("./data/resource.json", "utf-8"));
