import { Router } from "express";
import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";
import { Album } from "../models/album.model.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { getStats } from "../controller/stat.controller.js";

const router = Router();
router.use(protectRoute, requireAdmin);

router.get("/", getStats);

export default router;
