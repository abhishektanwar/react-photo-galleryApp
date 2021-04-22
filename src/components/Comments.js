import React,{ useState,useEffect } from 'react'
import { projectFirestore,projectStorage } from "../firebase/firebase"
import firebase from 'firebase'
const Comments = ({user,setCommentIconClicked,imgIdOfCommentClicked}) => {
	const [comments,setComments] = useState([])
	const [input,setInput] = useState(null)

	const handleDeleteComment = (comment) => {
		projectFirestore.collection('images').doc(imgIdOfCommentClicked).update({
			comments:firebase.firestore.FieldValue.arrayRemove(comment)
		})
		.then(()=>{console.log("comment deleted, confirm in firestore")})
		.catch((error) => {console.log("error in deleting comment")})
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
			console.log("comment post error")
		})

	}

	return (
		<div>
			<div>
				<div>
					<h3>Comments</h3>
					<button onClick={()=>{setCommentIconClicked(false)}}>close comments</button>
				</div>
				<div>
					{
						comments.length >0 ?
							comments.map((comment,id) => (
								<div key={id}>
									<p><span><img src={comment.commentedBy.photo} alt="" />{comment.commentedBy.name}</span></p>
									{comment.commentedBy.id === user.id ? <button onClick={()=>{handleDeleteComment(comment)}}>delete comment </button> : null}
									<p>{comment.comment}</p>
								</div>
							))
						:
						<h2>Be the first one to comment on this picture</h2>
					}
				</div>
				<div>
					<form>
						<input value={input} onChange={handleCommentInputChange} type="text" placeholder="write your comment"/>
						{input && <button onClick={handleCommentSubmit}>comment</button>}
					</form>
				</div>
			</div>
		</div>
	)
}

export default Comments
