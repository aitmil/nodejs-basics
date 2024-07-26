// src/server.js

import express from "express";
import pino from "pino-http";
import cors from "cors";

import studentsRouter from "./routers/students.js"; // Імпортуємо роутер
import { env } from "./utils/env.js";

// Імпортуємо middleware
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

const PORT = Number(env("PORT", "3000"));

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
  );

  app.get("/", (req, res) => {
    res.json({
      message: "Hello World!",
    });
  });

  app.use(studentsRouter); // Додаємо роутер до app як middleware

  app.use("*", notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
