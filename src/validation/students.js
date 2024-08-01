import Joi from "joi";

//Створимо схему валідації для обєкта при створенні нового студента:

export const createStudentSchema = Joi.object({
  // Оголошення схеми з кастомізованими повідомленнями
  name: Joi.string().min(3).max(30).required().messages({
    "string.base": "Username should be a string", // Кастомізація повідомлення для типу "string"
    "string.min": "Username should have at least {#limit} characters",
    "string.max": "Username should have at most {#limit} characters",
    "any.required": "Username is required",
  }),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(6).max(16).required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  avgMark: Joi.number().min(2).max(12).required(),
  onDuty: Joi.boolean(),
});

export const updateStudentSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  age: Joi.number().integer().min(6).max(16),
  gender: Joi.string().valid("male", "female", "other"),
  avgMark: Joi.number().min(2).max(12),
  onDuty: Joi.boolean(),
});

//після визначення схеми ви можете використовувати на ній методи валідації,
// такі як validate або validateAsync, для перевірки об'єктів даних на відповідність цій схемі.

//Можна зробити кастомізацію помилок.
// Важливо вказати { abortEarly: false } при виклику методу validate, щоб отримати всі можливі
// помилки валідації, а не першу з них:
// const validationResult = createStudentSchema.validate(userData, {
//   abortEarly: false,
// });
