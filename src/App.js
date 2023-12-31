/* eslint-disable jsx-a11y/alt-text */
//import logo from './logo.svg';
import './App.css';
import React, { useState , useRef} from 'react';
import firebase from 'firebase/compat/app';
//import 'bootstrap/dist/css/bootstrap.min.css';

import 'firebase/compat/auth'
import "firebase/compat/firestore";
import 'firebase/analytics';
//importing an inbuilt firebase hook
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from "react-firebase-hooks/firestore";


firebase.initializeApp({
  apiKey: "AIzaSyCwuRy3kKmgMWff8ulG0FAvs62hgS0FZzs",
  authDomain: "react-chat-app-c3c3d.firebaseapp.com",
  projectId: "react-chat-app-c3c3d",
  databaseURL : "https:/react-chat-app-c3c3d.firebaseio.com",
  storageBucket: "react-chat-app-c3c3d.appspot.com",
  messagingSenderId: "1057533927121",
  appId: "1:1057533927121:web:2a6884dc68fbc16891eff0",
  measurementId: "G-3LKEF7XV69",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>Chat-app</h1>
        <SignOut/>
      </header>
      <section>
        {user?<ChatRoom/>:<SignIn/>}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = ()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth
      .signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        console.log(user); // Check if photoURL is retrieved correctly
      })
      .catch((error) => {
        // Handle errors
      });
  }
  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      
    </>
  );
}

function SignOut() { 
  return auth.currentUser && (
      <button className='sign-out' onClick={()=> auth.signOut()}>Sign Out</button>
    )
}

function ChatRoom() {
  const dummy = useRef();

  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(1500);
  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />

        <button type="submit" disabled={!formValue}>
          
        </button>
      </form>
    </>
  );
}

function ChatMessage({ message }) {
  const { text, uid, photoURL } = message;
  console.log(message);
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="User Avatar" />
      <p>{text}</p>
    </div>
  );
}

export default App; 