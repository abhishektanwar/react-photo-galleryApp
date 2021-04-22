import ImageGrid from "./components/ImageGrid";
import Modal from "./components/Modal";
import Title from "./components/Title";
import UploadForm from "./components/UploadForm";
import { useState,useRef,useEffect } from 'react'
import { auth } from "./firebase/firebase" 
import 'firebase/auth'
import firebase from 'firebase/app'
import { BsFillPersonFill } from 'react-icons/bs'
// import { useAuth } from "./context/AuthContext"


function App() {
	const [selectedImg, setSelectedImg] = useState(null)
	const [user, setUser] = useState(null)
	const [isLoggedIn, setIsLoggedIn] =useState(false)
	const [error, setError]= useState();
	var provider = new firebase.auth.GoogleAuthProvider();


	const signIn = ()=>{
		firebase.auth()
		.signInWithPopup(provider)
		.then((result) => {
			let user = result.user;  
			setUser({id:user.uid, name:user.displayName, photo: user.photoURL})
			setIsLoggedIn(true)
			console.log(user)
		  // ...
		}).catch((error) => {
		  // Handle Errors here.
		  
			setError(error.message);
		  // The email of the user's account used.
		 
		  // ...
		});
	  }
	
	  useEffect(() => {
		firebase.auth().onAuthStateChanged(async (user) => {
		  if(user)
		  setUser({id:user.uid, name:user.displayName, photo: user.photoURL})
		  else
		  setUser(null)
		  
		})
	  }, [])

	return (
		<div className="App">
			<Title user={user} setError={setError}/>
			{!user && <div>
				<button className="signInButton" onClick={signIn}>
				Sign in with Google
				<BsFillPersonFill />
				</button>
			</div>}
			{error && <div>{error}</div>}
			{user && <UploadForm user={user} setError={setError} />}
			<ImageGrid setSelectedImg={setSelectedImg} user={user} setError={setError}/>
			{selectedImg && <Modal selectedImg={selectedImg} setSelectedImg={setSelectedImg }/>}
		</div>
	);
}

export default App;
