import express from "express";
import pino from "pino-http";
import cors from "cors";
import { env } from "./utils/env.js";
import { getAllStudents, getStudentById } from "./services/students.js";

// Читаємо змінну оточення PORT
const PORT = Number(env("PORT", "3000"));

if (isNaN(PORT)) {
  throw new Error("Invalid port number");
}

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

  //Використаймо функції сервісу студентів в контролерах.
  //Для цього створимо два нових маршрути для GET - запитів:
  // /students - маршрут для отримання колекції всіх студентів
  // /students/:studentId - маршрут для отримання студента за його id
  app.get("/students", async (req, res) => {
    const students = await getAllStudents();

    res.status(200).json({
      data: students,
    });
  });

  app.get("/students/:studentId", async (req, res, next) => {
    const { studentId } = req.params;
    const student = await getStudentById(studentId);

    // Відповідь, якщо контакт не знайдено
    if (!student) {
      res.status(404).json({
        message: "Student not found",
      });
      return;
    }

    // Відповідь, якщо контакт знайдено
    res.status(200).json({
      data: student,
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
