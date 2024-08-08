import { Router } from 'express';

import {
  getStudentsController,
  getStudentByIdController,
  createStudentController,
  deleteStudentController,
  upsertStudentController,
  patchStudentController,
} from '../controllers/students.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createStudentSchema,
  updateStudentSchema,
} from '../validation/students.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/', ctrlWrapper(getStudentsController));

router.get('/:studentId', isValidId, ctrlWrapper(getStudentByIdController));

//Далі додамо POST-роут /students та використаємо контролер.

router.post(
  '/register',
  validateBody(createStudentSchema),
  ctrlWrapper(createStudentController),
);

router.delete('/:studentId', isValidId, ctrlWrapper(deleteStudentController));

router.put(
  '/:studentId',
  validateBody(updateStudentSchema),
  isValidId,
  ctrlWrapper(upsertStudentController),
);

router.patch(
  '/:studentId',
  validateBody(updateStudentSchema),
  isValidId,
  ctrlWrapper(patchStudentController),
);

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
