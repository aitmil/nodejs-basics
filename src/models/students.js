import { model, Schema } from "mongoose";

//за допомогою класу Schema з бібліотеки mongoose,
//створимо схему для опису структури документа студента.

const studentsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    avgMark: {
      type: Number,
      required: true,
    },
    onDuty: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

//створюємо модель студента StudentsCollection за допомогою схеми.

export const StudentsCollection = model("students", studentsSchema);
