import get_location_status_json from "../processor/getLocationStatus";
export const reservationRouter = express.Router();

// Make a reservation
reservationRouter.put("/reservation", (req, res) => {
    // TODO: Implement this function
    return null;
});

// Cancel a reservation
reservationRouter.delete("/reservation", (req, res) => {
    // TODO: Implement this function
    return null;
});

//check reservation status
reservationRouter.get("/reservation/location", async (req, res) => {
    //TODO: Implement this function
    const { locationId, searchDate } = req.body;

    const reservation_status_JSON = await get_location_status_json(locationId, searchDate);

    res.json(reservation_status_JSON);

})