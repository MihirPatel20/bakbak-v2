import { Router } from "express";
import { exploreGrid } from "../controllers/explore.controllers.js";

const router = Router();

router.get("/", exploreGrid);

export default router;
