import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("ALbum route");
});

export default router;