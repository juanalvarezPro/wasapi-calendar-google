// routes/calendar.routes.ts
import { Router } from "express";
import { createEvent, listEvents, deleteEvent } from "../controllers/calendar";
import { auth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/create", auth, createEvent);
router.get("/list", auth, listEvents);
router.delete("/delete/:eventId", auth, deleteEvent);

export default router;
