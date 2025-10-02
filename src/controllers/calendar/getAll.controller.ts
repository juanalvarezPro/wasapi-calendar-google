import { DateHelper } from "../../helpers/dateHelper";
import { Request, Response } from "express";
import { GoogleCalendarService } from "../../services/GoogleCalendarService";
import { EventResource } from "../../resources/EventResource";

export const getEventsForChatbot = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { 
      days = 7,           // Días hacia adelante (default: 7)
      limit = 10,         // Límite de eventos (default: 10)
      type = "all"        // all, meetings, personal
    } = req.query;
  
    try {
      // Calcular fechas
      const now = new Date();
      const futureDate = DateHelper.addDays(now, parseInt(days as string));
  
      // Obtener eventos usando el service
      const events = await GoogleCalendarService.getEvents(user, {
        maxResults: parseInt(limit as string),
        timeMin: now.toISOString(),
        timeMax: futureDate.toISOString(),
      });
  
      if (!events.data.items?.length) {
        return res.json({
          success: true,
          message: "No hay eventos próximos",
          events: [],
          count: 0
        });
      }

      // Debug: Log de los datos que llegan de Google
      console.log("📅 Datos de eventos de Google:", JSON.stringify(events.data.items[0], null, 2));
    
      const chatbotEvents = events.data.items
        .map(event => EventResource.forChatbot(event))
        .filter(event => {
          // Aplicar filtro de tipo si es necesario
          if (type === "meetings") return event.title.toLowerCase().includes('reunión') || event.title.toLowerCase().includes('meeting');
          if (type === "personal") return !event.title.toLowerCase().includes('reunión') && !event.title.toLowerCase().includes('meeting');
          return true; // "all"
        });
  
      res.json({
        success: true,
        message: `Encontrados ${chatbotEvents.length} eventos`,
        events: chatbotEvents,
        count: chatbotEvents.length,
        period: `${days} días`,
        type: type
      });
  
    } catch (error) {
      console.error("❌ Error en getEventsForChatbot:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener eventos",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  };