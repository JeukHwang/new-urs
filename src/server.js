import cookieParser from "cookie-parser";
import express from "express";
import { authRouter } from "./router/auth.router.js";
import { reservationRouter } from "./router/reservation.router.js";
import { searchRouter } from "./router/search.router.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/search", searchRouter);
app.use("/api/reservation", reservationRouter);
app.use("/api/auth", authRouter);
app.post("/", (req, res) => {
    console.log("LOG /");
    res.json({ message: "Hello World" });
});
app.listen(3000, () => {
    console.log("New-URS server is running");
});