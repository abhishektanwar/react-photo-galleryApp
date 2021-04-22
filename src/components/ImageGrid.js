import React,{ useState } from 'react'
import useFirestore from '../hooks/useFirestore'
import { motion } from 'framer-motion'
import { projectFirestore,projectStorage } from "../firebase/firebase"
import firebase from 'firebase'
import Comments from './Comments'
import { AiFillDelete } from 'react-icons/ai'
import { GrFavorite } from 'react-icons/gr'
import { MdFavorite } from 'react-icons/md'
import { FaCommentAlt } from 'react-icons/fa'
const ImageGrid = ({setSelectedImg,user,setError}) => {
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
				setError(error)
				// console.log(error)
			})
		}
		else{
			setError("no user logged in.please log in")
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
			setError("no user logged in.please log in")
			console.log("no user logged in.please log in")
		}
	}

	const deleteImg = (imgId) => {
		projectFirestore.collection('images').doc(imgId).delete()
		.then(()=>{console.log("image delted")})
		.catch((error)=>{
			setError("failed to delete image")
			console.log("failed to delete image")})
	}
	
	const postComment = (docId) => {
		if(user){
			setCommentIconClicked(true)
			setImgIdOfCommentClicked(docId)
		}
		else{
			setError("please login to comment")
			console.log("please login to comment")
		}
	}

	return (
		<div className="img-grid">
			{ docs && docs.map(doc => (
				
				<motion.div className="img-wrap" key={doc.id} 
					layout
					whileHover={{opacity:1}}
					style={{marginBottom:"80px"}}
					
				>
					{/* user name and profile picture */}
					<div >
						<p className="username"><span style={{marginLeft:"10px"}}><img src={doc.userProfilePhoto} style={{width:'2.5rem', height:'2.5rem', borderRadius:'50%', marginRight:'0.5rem'}}/><span className="user_name">{doc.uploadedBy}</span></span>
						{user && doc.userId == user.id?<button style={{marginLeft:"20px"}} className="deleteButton" onClick={()=>{deleteImg(doc.id)}}><AiFillDelete style={{fill:"#3730A3"}}/></button>:null}
						</p>
					</div>
					<motion.img src={doc.url} alt="uploaded pic" onClick={()=>{setSelectedImg(doc.url)}}
						initial={{opacity:0}}
						animate={{opacity:1}}
						transition={{delay:1}}
					/>
					<div className="like-comment-buttons" style={{marginTop:"5px",marginLeft:"10px"}}>
						<div style={{flexGrow:1, paddingLeft:'5px'}}>
							{/* {console.log("uid",doc.id,user.id,doc.userId)}
							{console.log(doc.likedBy,"liked by")} */}
							{user && doc.likedBy.some(u=>u.id === user.id) ?
								<button onClick={()=>{disLike(doc.id)}}><MdFavorite style={{fill:"#3730A3"}}/></button>
							:
								<button onClick={()=>{incLike(doc.id)}}><GrFavorite /></button>
							}
							<span style={{paddingLeft:"8px"}}>{doc.likes} likes</span>
						</div>
						<button style={{marginLeft:"120px" }}onClick={()=>{postComment(doc.id)}}><FaCommentAlt style={{right:0, fill:"#3730A3"}} /></button>
					</div>
					
				</motion.div>
				
			)) }
			{commentIconClicked && <Comments user={user} setCommentIconClicked={setImgIdOfCommentClicked} imgIdOfCommentClicked={imgIdOfCommentClicked} setError={setError} setCommentIconClicked={setCommentIconClicked} />}
		</div>
	) 
}

export default ImageGrid
