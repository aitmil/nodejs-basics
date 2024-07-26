import { Router } from "express";
import { getAllStudents, getStudentById } from "../services/students.js";

const router = Router();

router.get("/students", async (req, res) => {
  const students = await getAllStudents();

  res.status(200).json({
    data: students,
  });
});

router.get("/students/:studentId", async (req, res, next) => {
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

export default router;

//1. Імпортуємо Router з Express, щоб створити об'єкт роутера router,
//після чого одразу експортуємо його.

//2. Далі переносимо контролери, які обробляють маршрути
// /students та /students /:studentId із файла server.js у файл роутингу
//students.js, але для їх оголошення замість app використовуємо створений router.
