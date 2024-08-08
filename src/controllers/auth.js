import { registerUser } from '../services/auth.js';
import { loginUser } from '../services/auth.js';
import { logoutUser } from '../services/auth.js';
import { ONE_DAY } from '../constants/index.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

// функція loginUserController обробляє HTTP - запит на вхід користувача,
// викликає функцію аутентифікації loginUser, встановлює куки для збереження
// токенів та ідентифікатора сесії, і відправляє клієнту відповідь з інформацією
// про успішний вхід та токеном доступу.

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

// функція logoutUserController обробляє HTTP-запит на вихід користувача,
// викликає функцію для видалення сесії logoutUser, очищає відповідні куки
// та відправляє клієнту відповідь про успішний вихід з системи.
