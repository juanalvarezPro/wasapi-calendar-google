import { GoogleCalendarService } from "@/services/GoogleCalendarService";
import { Request, Response } from "express";
import { EventResource } from "@/resources/EventResource";
import { DateHelper } from "@/helpers/dateHelper";


export const searchEvents = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { q, days = 30 } = req.query; // q = query de búsqueda
  
    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Parámetro 'q' (query) es requerido"
      });
    }
  
    try {
      const now = new Date();
      const futureDate = DateHelper.addDays(now, parseInt(days as string));
  
      // Buscar eventos usando el service
      const events = await GoogleCalendarService.getEvents(user, {
        maxResults: 50,
        timeMin: now.toISOString(),
        timeMax: futureDate.toISOString(),
        q: q as string
      });
  
      const searchResults = EventResource.collection(events.data.items || [])
        .map(event => EventResource.forChatbot(event));
  
      res.json({
        success: true,
        message: `Encontrados ${searchResults.length} eventos para "${q}"`,
        events: searchResults,
        count: searchResults.length,
        query: q
      });
  
    } catch (error) {
      console.error("❌ Error en searchEvents:", error);
      res.status(500).json({
        success: false,
        message: "Error al buscar eventos",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  };

  