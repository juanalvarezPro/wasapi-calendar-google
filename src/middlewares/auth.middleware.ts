// middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Extraer API key
    const apiKey = req.headers.authorization?.replace("Bearer ", "");
    
    if (!apiKey) {
      console.log(`Request sin API Key desde ${req.ip} - ${req.method} ${req.path}`);
      return res.status(401).json({
        success: false,
        message: "API Key requerida",
        code: "MISSING_API_KEY"
      });
    }

    // 2. Buscar usuario
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
      console.log(`API Key inválida: ${apiKey.substring(0, 8)}... desde ${req.ip} - ${req.method} ${req.path}`);
      return res.status(401).json({
        success: false,
        message: "API Key inválida",
        code: "INVALID_API_KEY"
      });
    }

    // 3. Validar que tenga access token (requerido para todas las rutas)
    if (!user.accessToken) {
      console.log(`❌ Usuario ${user.email} no tiene access token`);
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado con Google - falta access token",
        code: "NO_GOOGLE_AUTH"
      });
    }

    // 4. Log de acceso exitoso
    console.log(`Acceso autorizado: ${user.email} desde ${req.ip} - ${req.method} ${req.path}`);

    // 5. Guardar usuario en request
    (req as any).user = user;
    next();

  } catch (error) {
    console.error("❌ Error en auth:", error);
    res.status(500).json({
      success: false,
      message: "Error de autenticación",
      code: "AUTH_ERROR"
    });
  }
};
