import express from "express";
import UserRouter from "./user.router.js";
import HomeRouter from "./home.router.js";

const router = express.Router();

router.use("/user", UserRouter);
router.use("/", HomeRouter);
 
export default router;
