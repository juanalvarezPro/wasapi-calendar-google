import { google } from "googleapis";
import { createOAuthClient } from "../config/google";
import { UserService } from "./userGoogle.service";

export async function createEvent(eventData: any, userId: string) {
    // Obtener tokens desencriptados del usuario
    const accessToken = await UserService.getDecryptedAccessToken(userId);
    const refreshToken = await UserService.getDecryptedRefreshToken(userId);

    if (!accessToken) {
        throw new Error("Usuario no tiene permisos de Google Calendar. Debe autenticarse primero.");
    }

    // Crear cliente OAuth2 con las credenciales del usuario
    const googleClient = createOAuthClient();
    googleClient.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: googleClient });

    try {
        const response = await calendar.events.insert({
            calendarId: "primary",
            requestBody: {
                summary: eventData.summary,
                start: { dateTime: eventData.start, timeZone: "America/Bogota" },
                end: { dateTime: eventData.end, timeZone: "America/Bogota" },
            },
        });

        return response.data;
    } catch (error: any) {
        // Si el token expiró, intentar renovarlo una sola vez
        if (error.code === 401 && refreshToken) {
            try {
                const { credentials } = await googleClient.refreshAccessToken();
                
                // Actualizar tokens de forma segura (encriptados)
                await UserService.updateUserTokens(
                    userId, 
                    credentials.access_token!, 
                    credentials.refresh_token || undefined
                );

                // Actualizar credenciales del cliente
                googleClient.setCredentials({
                    access_token: credentials.access_token,
                    refresh_token: credentials.refresh_token,
                });

                // Reintentar la operación con el nuevo token
                const retryResponse = await calendar.events.insert({
                    calendarId: "primary",
                    requestBody: {
                        summary: eventData.summary,
                        start: { dateTime: eventData.start, timeZone: "America/Bogota" },
                        end: { dateTime: eventData.end, timeZone: "America/Bogota" },
                    },
                });

                return retryResponse.data;
            } catch (refreshError) {
                throw new Error("Sesión de Google expirada. El usuario debe volver a autenticarse.");
            }
        }
        
        throw error;
    }
}
