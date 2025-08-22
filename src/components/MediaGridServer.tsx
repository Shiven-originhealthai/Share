import MediaGrid from "./MediaGrid";

export default async function MediaGridServer() {
    const DicomImagesData = await fetch('http://localhost:3001/fetchDetails/John Doe')
    const dicomImagesJson = await DicomImagesData.json()
    console.log(dicomImagesJson.DicomImages)
    console.log(dicomImagesJson.patientDetailsArray)
    //const dicomImages = dicomImagesJson["DicomImages"]
    return (
      <MediaGrid dicomImages={dicomImagesJson.DicomImages}/>
    )
}