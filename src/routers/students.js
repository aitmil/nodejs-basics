import { Router } from "express";

import {
  getStudentsController,
  getStudentByIdController,
} from "../controllers/students";
import { ctrlWrapper } from "../utils/ctrlWrapper";

const router = Router();

router.get("/students", ctrlWrapper(getStudentsController));

router.get("/students/:studentId", ctrlWrapper(getStudentByIdController));

export default router;

//1. Імпортуємо Router з Express, щоб створити об'єкт роутера router,
//після чого одразу експортуємо його.

//2. Далі переносимо контролери, які обробляють маршрути
// /students та /students /:studentId із файла server.js у файл роутингу
//students.js, але для їх оголошення замість app використовуємо створений router.

//3. Тепер, імпортуємо створений роутер у файл server.js та додаємо його
//як middleware до app, за допомогою методу app.use().

//4. Для подальшої організації файлів застосунку виконаємо рефакторинг контролерів:
//створимо папку src/controllers, де будемо зберігати функції для обробки запитів.
//У файл src / controllers / students.js винесемо контролери, які зараз знаходяться
//у файлі роутингу src / routes / students.js

//5. Після цього використаємо контролери у файлі роутів.
