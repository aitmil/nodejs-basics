import { model, Schema } from 'mongoose';

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

// Перш за все, ми маємо виправити відповідь на роуті POST /auth/register,
// в якій окрім всього ми повертаємо пароль.Це не є безпечним.
// Проте це можна виправити за допомогою переписуванням методу
// toJSON() у схемі юзера:

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('users', usersSchema);

// Метод toJSON() викликається тоді, коли обʼєкт серіалізується
// (перетворюється на JSON) під час виклику JSON.stringify() або res.json().
