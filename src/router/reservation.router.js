import cancel_Reservation from "../processor/cancelReservation.js";
import get_location_status_json from "../processor/getLocationStatus.js";
import reserve_Location from "../processor/reserveLocation.js";
import express from 'express';
const reservationRouter = express.Router();

// Make a reservation
reservationRouter.put("/", async (req, res) => {
    // TODO: Implement this function
    const {locationId, resourceId, start_date, end_date, start_time, end_time} = req.body;
    const reserve_status = await reserve_Location(locationId, resourceId, start_date, end_date, start_time, end_time);

    if(reserve_status) {
        res.json({
            "reservation": "success",
            "reservation_number": reserve_status
        })
    } else {
        res.json({
            "reservation": "failed",
            "reservation_number": null
        })

    }
});

// Cancel a reservation
reservationRouter.delete("/", async (req, res) => {
    // TODO: Implement this function
    const {reservationId, locationId} = req.body;
    await cancel_Reservation(reservationId, locationId);
    res.json({
        "cancel": "success"
    })
    return null;
});

//check reservation status
reservationRouter.get("/location", async (req, res) => {
    //TODO: Implement this function
    const { locationId, searchDate } = req.body;

    const reservation_status_JSON = await get_location_status_json(locationId, searchDate);
    console.log(reservation_status_JSON);
    res.json(reservation_status_JSON);

})

export default reservationRouter;