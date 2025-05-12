import { Router } from "express";


const router = Router();

router.get("/", (req, res) => {
    req.auth.userId
    res.send("Admin route");
});

export default router; 