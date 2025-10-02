import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import chatbotRoutes from "./routes/chatbot.routes";

const app = express();

// Middlewares de seguridad
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Ruta de salud
app.get("/health", (req, res) => {
    res.json({ status: "OK", message: "API funcionando correctamente" });
});

export default app;