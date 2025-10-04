import { Router } from "express";
import { 
  getEventsForChatbot, 
  createEventFromChat, 
  searchEvents,
  deleteEventFromChat,
  calendarList,
  getEventsByCalendar
} from "../controllers/calendar"; 
import { auth } from "../middlewares/auth.middleware";

const router = Router();

// GET /api/calendar/ - Obtener lista de calendarios
router.get("/", auth, calendarList);

// GET /api/calendar/events - Obtener eventos para chatbot
router.get("/events", auth, getEventsForChatbot);

// GET /api/calendar/search - Buscar eventos por texto
router.get("/search", auth, searchEvents);

// GET /api/calendar/:calendarId/events - Obtener eventos de un calendario específico
router.get("/:calendarId/events", auth, getEventsByCalendar);

// POST /api/calendar/create - Crear evento desde chatbot
router.post("/create", auth, createEventFromChat);

// DELETE /api/calendar/delete/:eventId - Eliminar evento desde chatbot
router.delete("/delete/:eventId", auth, deleteEventFromChat);

export default router;