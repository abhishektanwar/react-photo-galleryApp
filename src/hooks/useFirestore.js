import React,{ useState,useEffect } from 'react'
import {projectFirestore} from "../firebase/firebase"

const useFirestore = (collection) => {
	const [docs,setDocs] = useState([])

	useEffect(()=>{
		const unsub = projectFirestore.collection(collection)
			.orderBy('createdAt','desc')
			.onSnapshot((snap)=>{
				let documents = []
				snap.forEach(doc => {
					documents.push({
						...doc.data(),id:doc.id
					})
				})
				setDocs(documents)
			})
			// cleanup function
			return () =>unsub()
	},[collection])
	return (
		{docs}
	)
}

export default useFirestore
