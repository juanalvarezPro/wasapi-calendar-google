import { createOAuthClient } from "@/config/google";
import { Request, Response } from "express";

export const googleAuth = (req: Request, res: Response) => {
    const url = createOAuthClient().generateAuthUrl({
      access_type: "offline",
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