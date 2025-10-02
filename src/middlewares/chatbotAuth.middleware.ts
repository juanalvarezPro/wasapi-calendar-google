import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";

export const chatbotAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers.authorization?.replace("Bearer ", "");
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: "API Key requerida para chatbot",
        code: "MISSING_API_KEY"
      });
    }

    // Buscar usuario por API key
    const user = await prisma.user.findUnique({
      where: { apiKey },
      select: {
        id: true,
        email: true,
        apiKey: true,
        accessToken: true,
        refreshToken: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "API Key inválida para chatbot",
        code: "INVALID_API_KEY"
      });
    }

    // Buscar que tenga access token en google
    if (!user.accessToken) {
      console.log(`❌ Usuario ${user.email} no tiene access token`);
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado con Google - falta access token",
        code: "NO_GOOGLE_AUTH"
      });
    }

    // Advertir si no hay refresh token (pero permitir continuar)
    if (!user.refreshToken) {
      console.log(`⚠️ Usuario ${user.email} no tiene refresh token - puede tener problemas de renovación`);
      // Agregar información sobre re-autenticación en el header de respuesta
      res.set('X-Refresh-Token-Status', 'missing');
      res.set('X-Reauth-Endpoint', '/api/auth/reauth');
    }

    // Agregar usuario al request
    (req as any).user = user;
    console.log(`Chatbot request from: ${user.email}`);
    next();

  } catch (error) {
    console.error("❌ Error en chatbotAuth:", error);
    res.status(500).json({
      success: false,
      message: "Error de autenticación del chatbot",
      code: "AUTH_ERROR"
    });
  }
};
