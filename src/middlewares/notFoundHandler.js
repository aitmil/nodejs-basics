// Перенесемо код middleware обробки помилок,
// коли клієнт звертається до неіснуючого маршруту із server.js у notFoundHandler.js

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: "Route not found",
  });
};
