import { google } from "googleapis";
import { Request, Response } from "express";

export const createEvent = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { summary, description, start, end } = req.body;
  
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: user.accessToken, refresh_token: user.refreshToken });
  
    const calendar = google.calendar({ version: "v3", auth });
  
    const event = await calendar.events.insert({
      calendarId: "primary",
      requestBody: { summary, description, start: { dateTime: start }, end: { dateTime: end } },
    });
  
    res.send(`✅ Evento creado: ${event.data.htmlLink}`);
  };
