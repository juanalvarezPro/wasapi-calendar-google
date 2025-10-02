import { google } from "googleapis";
import { Request, Response } from "express";

export const listEvents = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { 
      maxResults = 50, 
      timeMin, 
      timeMax,
      calendarId = "primary" 
    } = req.query;
  
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: user.accessToken, refresh_token: user.refreshToken });
  
    const calendar = google.calendar({ version: "v3", auth });
  
    // Configurar filtros de fecha
    const now = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(now.getMonth() + 1);
  
    const events = await calendar.events.list({
      calendarId: calendarId as string,
      maxResults: parseInt(maxResults as string),
      orderBy: "startTime",
      singleEvents: true,
      timeMin: timeMin ? new Date(timeMin as string).toISOString() : now.toISOString(),
      timeMax: timeMax ? new Date(timeMax as string).toISOString() : oneMonthFromNow.toISOString(),
    });
  
    if (!events.data.items?.length) {
      return res.json({
        success: true,
        message: "No hay eventos en el rango de fechas especificado",
        events: [],
        count: 0
      });
    }
  
    // Formatear eventos para respuesta JSON
    const formattedEvents = events.data.items.map((event) => ({
      id: event.id,
      title: event.summary,
      description: event.description,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      location: event.location,
      attendees: event.attendees?.length || 0,
      creator: event.creator?.email,
      htmlLink: event.htmlLink,
      status: event.status
    }));
  
    res.json({
      success: true,
      message: `Encontrados ${formattedEvents.length} eventos`,
      events: formattedEvents,
      count: formattedEvents.length,
      timeRange: {
        from: timeMin || now.toISOString(),
        to: timeMax || oneMonthFromNow.toISOString()
      }
    });
  };