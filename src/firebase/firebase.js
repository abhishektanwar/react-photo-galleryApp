import firebase from 'firebase/app' 
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth'
var app = firebase.initializeApp({
	apiKey: "AIzaSyAWn6mcqy7M3EndkSxs8WowO1xtk1ld9-w",
	authDomain: "photo-gallery-react-580f8.firebaseapp.com",
	projectId: "photo-gallery-react-580f8",
	storageBucket: "photo-gallery-react-580f8.appspot.com",
	messagingSenderId: "323331084733",
	appId: "1:323331084733:web:92655f81c408315a4fc2d4"
})

const projectStorage = firebase.storage() 
const projectFirestore = firebase.firestore()
const timestamp = firebase.firestore.FieldValue.serverTimestamp;
const auth = app.auth()
export { projectStorage,projectFirestore ,timestamp,auth }
export default app
