import { google } from "googleapis";
import { Request, Response } from "express";

export const deleteEvent = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { eventId } = req.params;
  
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: user.accessToken, refresh_token: user.refreshToken });
  
    const calendar = google.calendar({ version: "v3", auth });
  
    await calendar.events.delete({ calendarId: "primary", eventId });
  
    res.send(`❌ Evento ${eventId} eliminado correctamente.`);
  };
    