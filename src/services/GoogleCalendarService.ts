// services/GoogleCalendarService.ts
import { google } from "googleapis";
import { createOAuthClient } from "../config/google";
import { UserService } from "./userGoogle.service";

export class GoogleCalendarService {
  /**
   * Crear cliente de Google Calendar con manejo automático de tokens
   */
  static async createClient(user: any) {
    const auth = createOAuthClient();
    
    // Obtener tokens desencriptados
    const accessToken = await UserService.getDecryptedAccessToken(user.id);
    const refreshToken = await UserService.getDecryptedRefreshToken(user.id);

    if (!accessToken) {
      throw new Error("Usuario no tiene access token válido");
    }

    // Configurar credenciales
    const credentials: any = { 
      access_token: accessToken
    };
    
    if (refreshToken) {
      credentials.refresh_token = refreshToken;
    }
    
    auth.setCredentials(credentials);

    // Configurar refresh automático de tokens
    auth.on('tokens', async (tokens) => {
      console.log(`🔄 Tokens renovados para ${user.email}`);
      
      try {
        // Actualizar tokens usando UserService (encriptados)
        await UserService.updateUserTokens(
          user.id,
          tokens.access_token!,
          tokens.refresh_token || undefined
        );
        console.log(`✅ Tokens actualizados en BD para ${user.email}`);
      } catch (error) {
        console.error(`❌ Error actualizando tokens para ${user.email}:`, error);
      }
    });

    return google.calendar({ version: "v3", auth });
  }

  /**
   * Obtener eventos del calendario
   */
  static async getEvents(user: any, options: {
    maxResults?: number;
    timeMin?: string;
    timeMax?: string;
    calendarId?: string;
    q?: string;
  } = {}) {
    const calendar = await this.createClient(user);
    
    const {
      maxResults = 50,
      timeMin,
      timeMax,
      calendarId = "primary",
      q
    } = options;

    return await calendar.events.list({
      calendarId,
      maxResults,
      orderBy: "startTime",
      singleEvents: true,
      timeMin,
      timeMax,
      q
    });
  }

  /**
   * Crear evento en el calendario
   */
  static async createEvent(user: any, eventData: {
    summary: string;
    description?: string;
    start: { dateTime: string };
    end: { dateTime: string };
    location?: string;
    attendees?: Array<{ email: string; responseStatus: string }>;
  }) {
    const calendar = await this.createClient(user);
    
    return await calendar.events.insert({
      calendarId: "primary",
      requestBody: eventData
    });
  }

  /**
   * Eliminar evento del calendario
   */
  static async deleteEvent(user: any, eventId: string) {
    const calendar = await this.createClient(user);
    
    return await calendar.events.delete({
      calendarId: "primary",
      eventId
    });
  }

  /**
   * Obtener calendarios
   */
  static async getCalendars(user: any) {
    const calendar = await this.createClient(user);
    return await calendar.calendarList.list();
  }
}
