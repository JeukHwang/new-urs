import express from 'express';
import { get_locations, get_resources } from '../processor/util.js';

export const searchRouter = express.Router();

// Find favorite location by filter
searchRouter.get("/location/favorite", (req, res) => {
    const { userId } = req.body;
    // TODO: Implement this function
    return null;
});

function getTextFromLocation(location) {
    return [location.name, location.description, location.resourceDescription, location.tags.join(" "), location.manager].join(" ");
}

function getTextFromResource(resource) {
    return [resource.name, resource.description, resource.buildingNumber, resource.floor, resource.room, resource.capacity, resource.equipment].join(" ");
}

// Find location by filter
searchRouter.get("/location", async (req, res) => {
    const { text, tag, onlyOperational } = req.body;
    const filteredLocation = get_locations().filter((location) => {
        if (onlyOperational && !item.isOperational) return false;
        if (tag && !item.tags.includes(tag)) return false;
        if (text & getTextFromLocation(location).includes(text)) return true;
        return text & get_resources().some(resource => getTextFromResource(resource).includes(text));
    });
    return filteredLocation;
});

// Find resource from location
searchRouter.get("/resource", (req, res) => {
    const { locationId } = req.body;
    const location = get_locations().find((item) => item.id == locationId);
    const filteredResources = get_resources().filter((item) => location.resourceIds.includes(item.id));
    return filteredResources;
});