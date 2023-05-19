import express from "express";

export const authRouter = express.Router();

authRouter.get("/", (req, res) => {
    console.log("hello from auth!");
    return res.json({ message: "Hello from auth get" });
});
authRouter.post("/", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    console.log("Cookies", req.cookies);
    return res.json({ message: "Hello from auth post" });
});