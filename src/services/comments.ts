import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase"; // Импортируй свою конфигурацию Firebase

const addComment = async (userId: string, commentText: string) => {
  try {
    await addDoc(collection(db, "comments"), {
      userId,
      text: commentText,
      timestamp: new Date(),
    });
    console.log("Комментарий добавлен");
  } catch (error) {
    console.error("Ошибка при добавлении комментария:", error);
  }
};

export default addComment;
