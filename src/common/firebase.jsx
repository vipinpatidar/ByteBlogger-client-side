// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABBAZcmiqCspAR1ZCFPPw_dWQUzbkV_30",
  authDomain: "blogging-app-d2d7a.firebaseapp.com",
  projectId: "blogging-app-d2d7a",
  storageBucket: "blogging-app-d2d7a.appspot.com",
  messagingSenderId: "776831455308",
  appId: "1:776831455308:web:3ab117b654f2c0556e64e9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
  try {
    let user = null;

    const result = await signInWithPopup(auth, googleProvider);

    user = await result.user;

    return user;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
