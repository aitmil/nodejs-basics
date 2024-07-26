import { StudentsCollection } from "../models/students.js";

export const getAllStudents = async () => {
  const students = await StudentsCollection.find();
  return students;
};

export const getStudentById = async (studentId) => {
  const student = await StudentsCollection.findById(studentId);
  return student;
};

//Метод find() моделі StudentsCollection — це вбудований метод Mongoose
//для пошуку документів у MongoDB.Викликаючи find() на моделі StudentsCollection,
//ми отримаємо масив документів, що відповідають моделі Student.У випадку,
//якщо колекція студентів порожня, метод повертає порожній масив

//Метод findById() моделі StudentsCollection — це вбудований метод Mongoose для
//пошуку одного документа у MongoDB за його унікальним ідентифікатором.
//Викликаючи findById() на моделі StudentsCollection із вказаним ідентифікатором
//студента, ми отримаємо документ, що відповідає цьому ідентифікатору, як об'єкт Student.
//Якщо документ із заданим ідентифікатором не буде знайдено, метод поверне null
