import { initMongoDB } from "./db/initMongoDB.js";
import { startServer } from "./server.js";

//ми створимо функцію bootstrap, яка буде ініціалізувати підключення до бази даних,
//після чого запускати сервер.

const bootstrap = async () => {
  await initMongoDB();
  startServer();
};

bootstrap();
