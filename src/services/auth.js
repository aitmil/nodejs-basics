import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import { SessionsCollection } from '../models/session.js';
import { UsersCollection } from '../models/user.js';

export const registerUser = async (payload) => {
  // Під час створення моделі UsersCollection ми вказали, що email користувача
  // має бути унікальним.Тому нам варто перевіряти email на унікальність під час
  // реєстрації та, у разі дублювання, повертати відповідь зі статусом 409 і
  // відповідним повідомленням.Тому додамо таку перевірку у код нашого сервісу для реєстрації:

  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  // Додаємо хеш-функцію для хешування паролю:

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password); // Порівнюємо хеші паролів

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

// Ця функція loginUser виконує процес аутентифікації користувача.
// Вона приймає об'єкт payload, що містить дані для входу, такі як email та пароль.

// Спочатку функція шукає користувача в базі даних за наданою електронною поштою.
// Якщо користувача з таким email не знайдено, функція викликає помилку з кодом 404,
// вказуючи, що користувач не знайдений.
// Якщо користувач знайдений, функція порівнює введений користувачем пароль з хешованим
// паролем, збереженим у базі даних.Це здійснюється за допомогою бібліотеки bcrypt.
// Якщо паролі не співпадають, викликається помилка з кодом 401, вказуючи,
// що користувач неавторизований.
// Далі, функція видаляє попередню сесію користувача, якщо така існує,
// з колекції сесій.Це робиться для уникнення конфліктів з новою сесією.
// Після цього генеруються нові токени доступу та оновлення.
// Використовуються випадкові байти, які конвертуються в строку формату base64.
// Нарешті, функція створює нову сесію в базі даних.
// Нова сесія включає ідентифікатор користувача, згенеровані токени доступу та оновлення,
// а також часові межі їхньої дії.Токен доступу має обмежений термін дії(наприклад, 15 хвилин),
// тоді як токен для оновлення діє довше(наприклад, один день).

// Таким чином, функція забезпечує аутентифікацію користувача,
// перевіряє його дані для входу, видаляє попередню сесію,
// генерує нові токени та створює нову сесію в базі даних.

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};
