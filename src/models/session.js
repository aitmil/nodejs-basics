import { model, Schema } from 'mongoose';

const sessionsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const SessionsCollection = model('sessions', sessionsSchema);

// аша сесія буде складатися з:
// - Access токену - короткоживучий(в нашому випадку 15 хвилин)
// токен, який браузер буде нам додавати в хедери запитів(хедер Authorization)
// - Терміну життя access токену
// - Refresh токену - більш довгоживучому (в нашому випадку 1 день,
// але може бути і більше) токену, який можна буде обміняти на окремому
// ендпоінті на нову пару access + resfresh токенів.Зберігається в cookies
// - Терміну життя refresh токену
// - Id юзера, якому належить сесія.
