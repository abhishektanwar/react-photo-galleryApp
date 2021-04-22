import React,{useState} from 'react'
import { auth } from "../firebase/firebase"
import { IoLogOutSharp } from 'react-icons/io5'
const Title = ({user,setError}) => {
	const signOut =() => {
		auth.signOut()
			.then(()=>{
				console.log("user signed out")
			})
			.catch((err)=> {
				setError(err)
			})
	}
	return (
		<div className="title">
			
			<h1>Memz Gram</h1>
			{/* <h2>Your pictures</h2> */}
			{/* <p>Lorel Ipsum</p> */}
			{user && <button style={{width:'2.5rem',height:'2.5rem',marginLeft:'70%'}} onClick={signOut}><IoLogOutSharp /></button>}
			
		</div>
	)
}

export default Title
