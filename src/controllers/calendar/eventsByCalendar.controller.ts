import { GoogleCalendarService } from "../../services/GoogleCalendarService";
import { Request, Response } from "express";

export const getEventsByCalendar = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { calendarId } = req.params;
    const { maxResults, timeMin, timeMax, q } = req.query;

    try {
        const events = await GoogleCalendarService.getEvents(user, {
            calendarId,
            maxResults: maxResults ? parseInt(maxResults as string) : undefined,
            timeMin: timeMin as string,
            timeMax: timeMax as string,
            q: q as string
        });

        res.json({
            message: "Events retrieved successfully",
            calendarId,
            events: events.data.items || [],
            totalEvents: events.data.items?.length || 0
        });
        
    } catch (error) {
        console.error("❌ Error en getEventsByCalendar:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener eventos del calendario",
            error: error instanceof Error ? error.message : "Error desconocido"
        });
    }
};
