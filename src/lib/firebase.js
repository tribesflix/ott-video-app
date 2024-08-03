import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCUI_V0t08d40j5o9G1gescpsQf15ApMz8",
  authDomain: "tribesflix-db.firebaseapp.com",
  projectId: "tribesflix-db",
  storageBucket: "tribesflix-db.appspot.com",
  messagingSenderId: "286614717099",
  appId: "1:286614717099:web:2a1fe1cbc2d64e222dadee"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyBioo9hH5K4-vLfrEAJlu5fmW7FtbhYmmY",
//   authDomain: "video-streaming-app-59520.firebaseapp.com",
//   projectId: "video-streaming-app-59520",
//   storageBucket: "video-streaming-app-59520.appspot.com",
//   messagingSenderId: "724201458845",
//   appId: "1:724201458845:web:a1a889c802f6a8d658d874"
// };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };