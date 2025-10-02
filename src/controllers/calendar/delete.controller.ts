import { GoogleCalendarService } from "@/services/GoogleCalendarService";
import { Request, Response } from "express";
    
export const deleteEventFromChat = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { eventId } = req.params;
  
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "ID del evento es requerido"
      });
    }
  
    try {
      // Eliminar evento usando el service
      await GoogleCalendarService.deleteEvent(user, eventId);
  
      res.json({
        success: true,
        message: `Evento ${eventId} eliminado correctamente`,
        eventId
      });
  
    } catch (error) {
      console.error("❌ Error en deleteEventFromChat:", error);
      res.status(500).json({
        success: false,
        message: "Error al eliminar evento",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  };    