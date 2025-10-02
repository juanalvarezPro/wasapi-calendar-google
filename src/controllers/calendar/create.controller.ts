import { DateHelper } from "@/helpers/dateHelper";
import { Request, Response } from "express";
import { GoogleCalendarService } from "@/services/GoogleCalendarService";
import { EventResource } from "@/resources/EventResource";


export const createEventFromChat = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const {
        title,
        date,      // Fecha en formato "2024-01-15"
        time,      // Hora en formato "10:00"
        minutes,   // Duración en minutos
        email,     // Email del cliente
        location
    } = req.body;

    try {
        // Crear fecha completa combinando date y time
        const startTime = DateHelper.combineDateTime(date, time);
        const endTime = DateHelper.addMinutes(startTime, minutes);

        // Preparar invitados si se proporciona email
        let attendees: Array<{ email: string; responseStatus: string }> = [];
        if (email) {
            attendees = [
                {
                    email: email,
                    responseStatus: 'needsAction'
                }
            ];
        }

        // Crear evento usando el service
        const event = await GoogleCalendarService.createEvent(user, {
            summary: title,
            start: { dateTime: startTime.toISOString() },
            end: { dateTime: endTime.toISOString() },
            location: location || undefined,
            attendees: attendees.length > 0 ? attendees : undefined
        });

        // Formatear respuesta usando Resource
        const formattedEvent = EventResource.forChatbot(event.data);

        res.json({
            success: true,
            message: "Evento creado exitosamente",
            event: {
                ...formattedEvent,
                email: email || null
            }
        });

    } catch (error) {
        console.error("❌ Error en createEventFromChat:", error);
        res.status(500).json({
            success: false,
            message: "Error al crear evento",
            error: error instanceof Error ? error.message : "Error desconocido"
        });
    }
};
