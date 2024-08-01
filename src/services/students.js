import { StudentsCollection } from "../models/students.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";
import { SORT_ORDER } from "../constants/index.js";

// Залишилось додати до сервісу логіку для того, щоб правильно запитувати дані
// з бази даних з пагінацією та сортуванням:

export const getAllStudents = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = "_id",
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const studentsQuery = StudentsCollection.find();

  if (filter.gender) {
    studentsQuery.where("gender").equals(filter.gender);
  }
  if (filter.maxAge) {
    studentsQuery.where("age").lte(filter.maxAge);
  }
  if (filter.minAge) {
    studentsQuery.where("age").gte(filter.minAge);
  }
  if (filter.maxAvgMark) {
    studentsQuery.where("avgMark").lte(filter.maxAvgMark);
  }
  if (filter.minAvgMark) {
    studentsQuery.where("avgMark").gte(filter.minAvgMark);
  }

  /* Замість цього коду */
  // const studentsCount = await StudentsCollection.find()
  //   .merge(studentsQuery)
  //   .countDocuments();

  // const students = await studentsQuery
  //   .skip(skip)
  //   .limit(limit)
  //   .sort({ [sortBy]: sortOrder })
  //   .exec();

  /* Ми можемо написати такий код */

  const [studentsCount, students] = await Promise.all([
    StudentsCollection.find().merge(studentsQuery).countDocuments(),
    studentsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);
  // Цей рефакторинг коду використовує підхід паралельної обробки запитів
  // до бази даних за допомогою Promise.all, що дозволяє ефективніше використовувати
  // ресурси і скоротити час відповіді сервера.

  const paginationData = calculatePaginationData(studentsCount, perPage, page);

  return {
    data: students,
    ...paginationData,
  };
};

// Тепер сервісна функція getAllStudents приймає об'єкт з параметрами page та perPage,
// що вказують номер сторінки та кількість записів на сторінці відповідно.

// Функція getAllStudents спочатку розраховує зміщення (skip), що дорівнює кількості записів,
// що мають бути пропущені перед початком видачі на поточній сторінці.Вона також розраховує
// ліміт записів, які мають бути повернуті на одній сторінці.

// Далі, функція ініціює запит до бази даних для отримання списку студентів,
// використовуючи спеціальні методи skip та limit для застосування пагінації.
// Паралельно, вона робить запит для визначення загальної кількості студентів
// за допомогою методу countDocuments.

// Після отримання списку студентів і загальної кількості, функція викликає
// сalculatePaginationData, яка обраховує і повертає дані для пагінації,
// зокрема інформацію про загальну кількість сторінок і чи є наступна чи попередня сторінка.

// Результатом виконання функції є об'єкт, що містить масив з даними про студентів
// і додаткову інформацію про пагінацію, що дозволяє клієнту легко навігувати
// між сторінками результатів.

// Тепер ми маємо можливість сортувати результати запиту до бази даних студентів.
// Параметри sortOrder та sortBy, визначені зі значеннями за замовчуванням,
// дозволяють визначити порядок сортування та поле, за яким потрібно виконати
// сортування(_id за замовчуванням).

// Під час виклику функції, studentsQuery — запит до бази даних,
// що ініціюється за допомогою StudentsCollection.find(), налаштовується так,
// що він тепер включає, окрім методів skip та limit(для реалізації пагінації),
// ще й метод sort.Цей метод дозволяє організувати записи за полем, вказаним у sortBy,
// у порядку, заданому у sortOrder. Таке сортування дозволяє користувачам отримувати
// дані в порядку, який найкраще відповідає їхнім потребам, забезпечуючи
// більшу гнучкість та зручність у взаємодії з даними.

export const getStudentById = async (studentId) => {
  const student = await StudentsCollection.findById(studentId);
  return student;
};

//Додаємо у сервіс студентів функцію, яка буде записувати отримані дані (payload) у базу даних.

export const createStudent = async (payload) => {
  const student = await StudentsCollection.create(payload);
  return student;
};

export const deleteStudent = async (studentId) => {
  const student = await StudentsCollection.findOneAndDelete({
    _id: studentId,
  });
  return student;
};

//Додаємо у сервіс студентів функцію, яка буде оновлювати дані про студента (payload)
//по ідентифікатору(studentId) в базі даних.

export const updateStudent = async (studentId, payload, options = {}) => {
  const rawResult = await StudentsCollection.findOneAndUpdate(
    { _id: studentId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    }
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    student: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

//Оскільки ми вже маємо функцію сервісу updateStudent,
// яку ми до цього створили для PUT ендпоінта, то можемо не створювати нову для PATCH,
//а перевикористати її.Єдина відмінність буде полягати в тому, що ми не
//будемо під час виклику нічого передавати третім аргументом options,
//оскільки ми завчасно продумали цей варіант і задали options дефолтне значення
//як порожній обєкт

//------------------

//Метод find() моделі StudentsCollection — це вбудований метод Mongoose
//для пошуку документів у MongoDB.Викликаючи find() на моделі StudentsCollection,
//ми отримаємо масив документів, що відповідають моделі Student.У випадку,
//якщо колекція студентів порожня, метод повертає порожній масив

//------------------

//Метод findById() моделі StudentsCollection — це вбудований метод Mongoose для
//пошуку одного документа у MongoDB за його унікальним ідентифікатором.
//Викликаючи findById() на моделі StudentsCollection із вказаним ідентифікатором
//студента, ми отримаємо документ, що відповідає цьому ідентифікатору, як об'єкт Student.
//Якщо документ із заданим ідентифікатором не буде знайдено, метод поверне null

//------------------

//Для створення нового документа в колекції, на основі вказаної моделі,
//в Mongoose використовується метод:
//Model.create(doc)
//де:
//--doc — перший аргумент (обовязковий), який містить дані
//(обєкт або масив обєктів), які будуть використані для створення
//нового документа або документів у колекції.База даних створює новий
//документ, додає до нього унікальний ідентифікатор та повертає створений обєкт.

//------------------

//Для видалення документа з колекції в Mongoose використовується метод:
//findOneAndDelete(filter, options, callback)
//де:
//--filter — перший аргумент, який вказує на умову, за якою відбувається пошук документа
//для видалення.Передається як обєкт з властивостями.Обов'язковий аргумент
//--options — обєкт який може містити додаткові властивості для налаштування видалення.
//Наприклад, можна використовувати опцію sort, щоб вказати порядок сортування документів
//перед видаленням.Необов'язковий аргумент
//--callback — якщо не використовується async/await, можна передати функцію зворотного
//виклику для обробки результату операції.Необов'язковий аргумент.

//------------------

//Для оновлення документа в колекції, на основі вказаної моделі,
//в Mongoose використовується метод:
//Model.findOneAndUpdate(query, update, options, callback)
//де:
//--query — перший аргумент(обовязковий) це обєкт, який містить умови пошуку документа
//у колекції за його властивостями
//--update — другий аргумент (обовязковий) це обєкт, який містить дані для оновлення.
//Може бути звичайним обєктом з новими значеннями полів або використовувати спеціальні
//оператори оновлення MongoDB, такі як $set, $inc тощо
//--options — третій аргумент (обов'язковий) це обєкт додаткових налаштувань
//(може бути порожнім { }), таких як:
//-new: повертає оновлений документ, якщо true
//-upsert: створює новий документ, якщо відповідний не знайдено
//--callback - четвертий аргумент (необовязковий) це функція зворотного виклику
//для обробки результату
