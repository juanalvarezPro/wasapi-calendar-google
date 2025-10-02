import { Router } from "express";
import { 
  getEventsForChatbot, 
  createEventFromChat, 
  searchEvents,
  deleteEventFromChat
} from "../controllers/calendar"; 
import { auth } from "../middlewares/auth.middleware";

const router = Router();

// GET /api/chatbot/events - Obtener eventos para chatbot
router.get("/events", auth, getEventsForChatbot);

// POST /api/chatbot/create - Crear evento desde chatbot
router.post("/create", auth, createEventFromChat);

// GET /api/chatbot/search/:q - Buscar eventos por texto
router.get("/search", auth, searchEvents);

// DELETE /api/chatbot/delete/:eventId - Eliminar evento desde chatbot
router.delete("/delete/:eventId", auth, deleteEventFromChat);

export default router;