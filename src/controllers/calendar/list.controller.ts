import { GoogleCalendarService } from "../../services/GoogleCalendarService";
import { Request, Response } from "express";

export const calendarList = async (req: Request, res: Response) => {
    const user = (req as any).user
    try {
        const allCalendars = await GoogleCalendarService.getCalendars(user);
        res.json({
            message: "Calendar API",
            calendars: allCalendars.data.items
        });
        
    } catch (error) {
        console.error("❌ Error en calendarList:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener calendarios",
            error: error instanceof Error ? error.message : "Error desconocido"
        });
        
    }

};  