import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyDHfpCi7jbGN4X_E4EPiLi8qhftAJuvXtM",
  authDomain: "react-slack-clone-app.firebaseapp.com",
  databaseURL: "https://react-slack-clone-app.firebaseio.com",
  projectId: "react-slack-clone-app",
  storageBucket: "react-slack-clone-app.appspot.com",
  messagingSenderId: "414510041460",
  appId: "1:414510041460:web:cf642272f04a7de548c421",
  measurementId: "G-64P0VYF93M"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
