import express from "express";
import pino from "pino-http";
import cors from "cors";
import { env } from "./utils/env.js";

// Читаємо змінну оточення PORT
const PORT = Number(env("PORT", "3000"));

export const startServer = () => {
  const app = express();

  // Вбудований у express middleware для обробки (парсингу) JSON-даних у запитах
  // наприклад, у запитах POST або PATCH
  app.use(express.json());

  // Middleware cors
  app.use(cors());

  // Middleware для логування
  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
  );

  // Маршрут для обробки GET-запитів на '/'
  app.get("/", (req, res) => {
    res.json({
      message: "Hello, World!",
    });
  });

  // Middleware для обробки помилки в маршруті)
  app.use("*", (req, res, next) => {
    res.status(404).json({
      message: "Not found",
    });
  });

  // Middleware для обробких помилок (приймає 4 аргументи)
  app.use((err, req, res, next) => {
    res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
