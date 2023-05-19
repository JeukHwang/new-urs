import express from "express";
import reservationRouter from "./router/reservation.router.js";
import { searchRouter } from "./router/search.router.js";

const app = express();
app.use(express.json());
app.use("/api/search", searchRouter);
app.use("/api/reservation", reservationRouter);
app.listen(3000, () => {
    console.log("New-URS server is running");
});