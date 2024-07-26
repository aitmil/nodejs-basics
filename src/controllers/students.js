import { getAllStudents, getStudentById } from "../services/students.js";

// 1. Імпортуємо функцію з бібліотеки
import createHttpError from "http-errors";

export const getStudentsController = async (req, res) => {
  const students = await getAllStudents();

  res.json({
    status: 200,
    message: "Successfully found students!",
    data: students,
  });
};

//Доповнимо код контролера getStudentByIdController параметром
//next і створенням обєкта помилки, якщо студента не знайдено:

export const getStudentByIdController = async (req, res, next) => {
  const { studentId } = req.params;
  const student = await getStudentById(studentId); // Код який був до цього
  // if (!student) {
  //res.status(404).json({
  //message: "Student not found",
  //});
  //return;
  // }

  // А тепер додаємо базову обробку помилки замість res.status(404)
  //   if (!student) {
  //     next(new Error("Student not found"));
  //     return;
  //   }

  if (!student) {
    // 2. Створюємо та налаштовуємо помилку
    throw createHttpError(404, "Student not found");
  }

  res.json({
    status: 200,
    message: `Successfully found student with id ${studentId}!`,
    data: student,
  });
};

//Після виклику next, обробник помилок в нашому додатку (error middleware)
//у файлі server.js, перехопить і опрацює цю помилку.
