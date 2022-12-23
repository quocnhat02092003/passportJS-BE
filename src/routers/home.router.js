import express from "express";
import HomeController from "../controllers/home.controller.js";


const router = express.Router();

router.get("/",HomeController.home)
export default router;
