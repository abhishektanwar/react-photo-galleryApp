import React,{ useState } from 'react'

const UploadForm = () => {
	const [file,setFile] = useState(null)
	const [error,setError] = useState(null)
	const allowedTypes = ['image/png','image/jpeg']
	const changeHandlerImage = (e) => {
		// console.log("changed")
		let selected = e.target.files[0]
		// we would only want to change the state of file if only
		// a file has been selected by user. If a user clicks upload 
		// button but doesnt select a file and just cancels it 
		// then there is nothing to upload

		if (selected && allowedTypes.includes(selected.type)){
			setFile(selected)
		} else{
			setFile(null)
			setError("please select an image file (png or jpeg)")

		}
		
	}
	return (
		<form>
			<input type="file" onChange={changeHandlerImage}/>
		</form>
	)
}

export default UploadForm;
