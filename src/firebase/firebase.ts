import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";
const db = getFirestore();

const firebaseConfig = {
  apiKey: "AIzaSyDqELujli9xRysaF4pmWKtr1KC2Z2xHCxg",
  authDomain: "episode-chooser.firebaseapp.com",
  projectId: "episode-chooser",
  storageBucket: "episode-chooser.firebasestorage.app",
  messagingSenderId: "383166674697",
  appId: "1:383166674697:web:c0012f1128b11e91e3c5d8",
  measurementId: "G-B5M1Z1H443",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Пользовотель вошел через Google: ", user);
  } catch (error) {
    console.error("Ошибка при входе через Google: ", error);
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("Пользователь вышел.");
  } catch (error) {
    console.error("Ошибка при выходе: ", error);
  }
};

export const checkUserPermissions = async (
  userId: string
): Promise<boolean> => {
  const userRef = doc(db, "authorized_users", userId);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    const userData = docSnap.data();
    return userData.canComment === true;
  } else {
    await setDoc(userRef, { canComment: true });
    return true;
  }
};

export { auth, db };
