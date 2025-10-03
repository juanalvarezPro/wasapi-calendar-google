import { createOAuthClient } from "../../config/google";
import { Request, Response } from "express";

export const googleAuth = (req: Request, res: Response) => {
    const url = createOAuthClient().generateAuthUrl({
      access_type: "offline",
      prompt: "consent", // SIEMPRE forzar consentimiento para obtener refresh_token
      scope: [
        "openid",
        "email", 
        "profile",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/gmail.readonly"
      ]
    });
    res.redirect(url);
  };

export const googleReauth = (req: Request, res: Response) => {
    const url = createOAuthClient().generateAuthUrl({
      access_type: "offline",
      prompt: "consent", // Forzar consentimiento para obtener refresh token
      scope: [
        "openid",
        "email", 
        "profile",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/gmail.readonly"
      ]
    });
    res.redirect(url);
  };