import React,{useState} from 'react'
import { auth } from "../firebase/firebase"

const Title = ({user}) => {
	const [error,setError] = useState(null)
	const signOut =() => {
		auth.signOut()
			.then(()=>{
				console.log("user signed out")
			})
			.catch((err)=> {
				console.log(err)
			})
	}
	return (
		<div className="title">
			{error && <div>{error}</div>}
			<h1>FireGram</h1>
			<h2>Your pictures</h2>
			<p>Lorel Ipsum</p>
			{user && <button onClick={signOut}>signout</button>}
		</div>
	)
}

export default Title
