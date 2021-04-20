// custom hook for firebase-storeage-hook
import { useState,useEffect } from 'react'
import { projectStorage,projectFirestore,timestamp } from "../firebase/firebase"

const useStorage = (file) => {
	const [error,setError] = useState(null)
	const [progress,setProgress] = useState(0)
	const [url,setUrl] = useState('')

	// logic inside useEffect is going to file everytime
	// the file dependancy changes , everytime we have a new file 
	// value , it is going to run the code inside useEffect to upload
	// that file
	useEffect(() => {
		let storageRef = projectStorage.ref(file.name)
		const collectionRef = projectFirestore.collection('images')
		// what we are doing in the above line of code is creating a reference
		// to the file inside the default firebase storage bucket.
		// now that file doesnt exist yet . we are just saying that when we upload 
		// somehting using this reference ,the file should have this name
		// ('file.name') inside the bucket

		// so now we can use a method called 'put' on above storage reference
		// and that will take the file and put it in the reference that location
		storageRef.put(file).on('state_changed',(snap) => {
			let percentage = (snap.bytesTransferred / snap.totalBytes) * 100
			setProgress(percentage)
		},(err) => {
			setError(err)
		},async () => {
			const url = await storageRef.getDownloadURL()
			const createdAt = timestamp()
			console.log(createdAt)
			// adding the url of the image uploaded in storage to the firestore document
			// so that images can be rendered by fetching urls from firestore doc
			collectionRef.add({
				url:url,
				createdAt:createdAt
			})
			setUrl(url)
		})
		//and this sets about uploading the file to
		// storageReference 
		// storage.ref is async as it take sometime to complete its job and
		// we can set some listeners toit which is gonna fire functions when 
		// certain events happen
		// 


	},[file]) //here file is the dependancy which means
	// run the useEffect hook or logic inside useEffect hook
	// as soon as the value of file changes
	return { progress,url,error }
}
export default useStorage;