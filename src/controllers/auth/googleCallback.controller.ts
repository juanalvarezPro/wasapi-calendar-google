import { createOAuthClient } from "../../config/google";
import { Request, Response } from "express";
import { decode } from "jsonwebtoken";
import { GoogleIdToken } from "./type";
import { UserService } from "../../services/userGoogle.service";

export const googleCallback = async (req: Request, res: Response) => {
    try {
        const code = req.query.code as string;
        if (!code) return res.status(400).send("Falta el código de Google OAuth");

        // Procesamos el callback de Google

        const oauth2Client = createOAuthClient();
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Verificar que tengamos al menos un access token
        if (!tokens.access_token) {
            console.error("❌ No se recibió access_token de Google");
            return res.status(400).send("Error: No se pudo obtener access token de Google");
        }

        // Obtenemos el email del id_token
        let email: string;

        if (tokens.id_token) {
            const decoded = decode(tokens.id_token) as GoogleIdToken;
            email = decoded.email;
            console.log(`📧 Email obtenido del id_token: ${email}`);
        } else {
            // Si no hay id_token, intentamos obtener el email de otra manera
            console.log("⚠️ No hay id_token, intentando obtener email del access_token...");

            try {
                // Usamos el access_token para obtener información del usuario
                const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                    headers: {
                        'Authorization': `Bearer ${tokens.access_token}`
                    }
                });

                if (response.ok) {
                    const userInfo = await response.json();
                    email = userInfo.email;
                    console.log(`📧 Email obtenido de Google API: ${email}`);
                } else {
                    throw new Error('No se pudo obtener email de Google API');
                }
            } catch (error) {
                console.log("❌ Error obteniendo email, usando temporal");
                email = `user_${Date.now()}@temp.com`;
            }
        }

        // Log de tokens obtenidos
        if (tokens.refresh_token) {
            console.log("✅ Refresh token obtenido, se guardará encriptado en la base de datos");
        } else {
            console.log("⚠️ No se obtuvo refresh token - esto puede causar problemas futuros");
        }

        // Crear perfil de Google para el modelo
        const googleProfile = {
            id: email, // Usamos email como ID
            email,
            name: email.split('@')[0] // Nombre básico del email
        };

        // Usar el service para crear/actualizar usuario (con lógica de negocio)
        const user = await UserService.createOrUpdateUser(googleProfile, tokens);

        console.log(`✅ Usuario creado/actualizado: ${user.email}`);

        res.send(`
        ✅ Integración exitosa con Google<br/>
        Email: ${user.email}<br/>
        Tu API Key: <b>${user.apiKey}</b><br/>
        Guárdala para usar los endpoints.
      `);
    } catch (error) {
        console.error("❌ Error en callback de Google:", error);
        res.status(500).send("Error procesando la autenticación de Google");
    }
};
