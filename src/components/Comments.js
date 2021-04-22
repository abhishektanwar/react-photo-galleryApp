import React,{ useState,useEffect } from 'react'
import { projectFirestore,projectStorage } from "../firebase/firebase"
import firebase from 'firebase'
import { AiFillCloseCircle } from 'react-icons/ai'
import { AiFillDelete } from 'react-icons/ai'
import { FiSend } from 'react-icons/fi'
const Comments = ({user,setCommentIconClicked,imgIdOfCommentClicked,setError}) => {
	const [comments,setComments] = useState([])
	const [input,setInput] = useState('')

	const handleDeleteComment = (comment) => {
		projectFirestore.collection('images').doc(imgIdOfCommentClicked).update({
			comments:firebase.firestore.FieldValue.arrayRemove(comment)
		})
		.then(()=>{console.log("comment deleted, confirm in firestore")})
		.catch((error) => {
			setError("error in deleting comment")
			console.log("error in deleting comment")})
	}

	const handleCommentInputChange = (e) => {
		setInput(e.target.value)
	}

	useEffect(() => {
		const unsubscribe = projectFirestore.collection('images').doc(imgIdOfCommentClicked)
		.onSnapshot((snap)=>{
			let comm = []
			snap.data().comments.forEach(com => {
				comm.push(com)
			})
			setComments(comm)
		})
		return () => {
			unsubscribe()
		}
	}, [input])

	const handleCommentSubmit = (e) => {
		e.preventDefault()
		const comment = {comment:input,commentedBy:user}
		projectFirestore.collection('images').doc(imgIdOfCommentClicked).update({
			comments:firebase.firestore.FieldValue.arrayUnion(comment)
		})
		.then(()=>{
			setInput('')
			console.log("comment added,confirm in firestore")
		})
		.catch((error)=>{
			setError("comment post error")
			console.log("comment post error")
		})

	}

	return (
		<div className="backdrop-comments">
			<div className="comments">
				<div className="comment-header shadow">
					<h3>Comments {comments.length}</h3>
					<button onClick={()=>{setCommentIconClicked(false)}}><AiFillCloseCircle /></button>
				</div>
				<div className="comment-container">
					{
						comments.length >0 ?
							comments.map((comment,id) => (
								<div key={id} className="comment" >
									<p><span><img src={comment.commentedBy.photo} alt="" /><span style={{marginTop:"10px"}}>{comment.commentedBy.name}</span></span>
									{comment.commentedBy.id === user.id ? <button onClick={()=>{handleDeleteComment(comment)}}><AiFillDelete /></button> : null}

									</p>
									
									<p className="comment-line">{comment.comment}</p>
								</div>
							))
						:
						<h2>Be the first one to comment on this picture</h2>
					}
				</div>
				<div className="comment-footer">
					<form>
						<input className="comment-input" value={input} onChange={handleCommentInputChange} type="text" placeholder="write your comment"/>
						{input && <button onClick={handleCommentSubmit}><FiSend /></button>}
					</form>
				</div>
			</div>
		</div>
	)
}

export default Comments
