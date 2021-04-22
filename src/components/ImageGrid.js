import React,{ useState } from 'react'
import useFirestore from '../hooks/useFirestore'
import { motion } from 'framer-motion'
import { projectFirestore,projectStorage } from "../firebase/firebase"
import firebase from 'firebase'
import Comments from './Comments'
const ImageGrid = ({setSelectedImg,user}) => {
	const [commentIconClicked,setCommentIconClicked] = useState(false)
	const [imgIdOfCommentClicked,setImgIdOfCommentClicked] = useState(null)
	const {docs} = useFirestore('images')
	console.log(docs)
	const incLike = (id) => {
		if(user){
			projectFirestore.collection('images').doc(id).update({
				likes:firebase.firestore.FieldValue.increment(1),
				likedBy:firebase.firestore.FieldValue.arrayUnion(user)
			})
			.then(()=>{console.log("likes and likedby updated")})
			.catch((error) =>{
				console.log(error)
			})
		}
		else{
			console.log("no user logged in.please log in")
		}
	}
	
	const disLike = (id) => {
		if(user){
			projectFirestore.collection('images').doc(id).update({
				likes:firebase.firestore.FieldValue.increment(-1),
				likedBy:firebase.firestore.FieldValue.arrayRemove(user)
			})
			.then(()=>{console.log("likes and likedby updated")})
			.catch((error) =>{
				console.log(error)
			})
		}
		else{
			console.log("no user logged in.please log in")
		}
	}

	const deleteImg = (imgId) => {
		projectFirestore.collection('images').doc(imgId).delete()
		.then(()=>{console.log("image delted")})
		.catch((error)=>{console.log("failed to delete image")})
	}
	
	const postComment = (docId) => {
		if(user){
			setCommentIconClicked(true)
			setImgIdOfCommentClicked(docId)
		}
		else{
			console.log("please login to comment")
		}
	}

	return (
		<div className="img-grid">
			{ docs && docs.map(doc => (
				
				<motion.div className="img-wrap" key={doc.id} 
					layout
					whileHover={{opacity:1}}
					
				>
					{/* user name and profile picture */}
					<div className="username">
						<p><span><img src={doc.userProfilePhoto} style={{width:'2.5rem', height:'2.5rem', borderRadius:'50%', marginRight:'0.5rem'}}/>{doc.uploadedBy}</span>
						{user && doc.userId == user.id?<button onClick={()=>{deleteImg(doc.id)}}>delete</button>:null}
						</p>
					</div>
					<motion.img src={doc.url} alt="uploaded pic" onClick={()=>{setSelectedImg(doc.url)}}
						initial={{opacity:0}}
						animate={{opacity:1}}
						transition={{delay:1}}
					/>
					<div>
						<div>
							{/* {console.log("uid",doc.id,user.id,doc.userId)}
							{console.log(doc.likedBy,"liked by")} */}
							{user && doc.likedBy.some(u=>u.id === user.id) ?
								<button onClick={()=>{disLike(doc.id)}}>dislike</button>
							:
								<button onClick={()=>{incLike(doc.id)}}>Like</button>
							}
							<span>{doc.likes}</span>
						</div>
						<button onClick={()=>{postComment(doc.id)}}>Comment</button>
					</div>
					
				</motion.div>
				
			)) }
			{commentIconClicked && <Comments user={user} setCommentIconClicked={setImgIdOfCommentClicked} imgIdOfCommentClicked={imgIdOfCommentClicked} />}
		</div>
	) 
}

export default ImageGrid
