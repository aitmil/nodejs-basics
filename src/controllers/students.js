import {
  getAllStudents,
  getStudentById,
  createStudent,
  deleteStudent,
  updateStudent,
} from "../services/students.js";

// 1. Імпортуємо функцію з бібліотеки
import createHttpError from "http-errors";

import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";

// Додаємо пагінацію, фільтрацію та сортування:

export const getStudentsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const students = await getAllStudents({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

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

//Використаємо функцію сервісу у контролері. Для запитів, які щось створюють,
//семантично правильно відправляти відповідь зі статус - кодом 201 Created.:

export const createStudentController = async (req, res) => {
  const student = await createStudent(req.body);

  res.status(201).json({
    status: 201,
    message: `Successfully created a student!`,
    data: student,
  });
};

//Використаємо функцію сервісу у контролері та обробку помилки,
//якщо студента по такому id не буде знайдно.У разі успішного
//видалення повернемо порожню відповідь із статусом 204 No Content:

export const deleteStudentController = async (req, res, next) => {
  const { studentId } = req.params;

  const student = await deleteStudent(studentId);

  if (!student) {
    next(createHttpError(404, "Student not found"));
    return;
  }

  res.status(204).send();
};

//Метод PUT, згідно зі специфікацією, призначений для оновлення існуючого ресурсу
//за вказаним ID або створення нового, якщо такий ресурс відсутній.
//Для того, щоб функція updateStudent могла не тільки оновлювати,
//але й створювати ресурс при його відсутності, необхідно їй аргументом
//додатково передати { upsert: true }.

export const upsertStudentController = async (req, res, next) => {
  const { studentId } = req.params;

  const result = await updateStudent(studentId, req.body, {
    upsert: true,
  });

  if (!result) {
    next(createHttpError(404, "Student not found"));
    return;
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted a student!`,
    data: result.student,
  });
};

export const patchStudentController = async (req, res, next) => {
  const { studentId } = req.params;
  const result = await updateStudent(studentId, req.body);

  if (!result) {
    next(createHttpError(404, "Student not found"));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a student!`,
    data: result.student,
  });
};
