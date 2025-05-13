import { Router } from "express";
import { getAllSongs, getFeaturedSongs, getMadeForYouSongs, getTrendingSongs } from "../controller/song.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();
router.use(protectRoute, requireAdmin)

router.get("/", getAllSongs)
router.get("/featured", getFeaturedSongs)
router.get("/made-for-you", getMadeForYouSongs)
router.get("/trending", getTrendingSongs)

export default router;