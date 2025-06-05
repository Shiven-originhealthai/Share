import MediaGrid from "./MediaGrid";

export default function MediaGridServer() {
  const dicomImages = [
    { src: '/dicoms/brain.jpg', name: 'image1.dcm' },
    { src: '/dicoms/brain.jpg', name: 'image2.dcm' },
    { src: '/dicoms/brain.jpg', name: 'image3.dcm' },
    { src: '/dicoms/brain.jpg', name: 'image4.dcm' },
    { src: '/dicoms/brain.jpg', name: 'image5.dcm' },
    { src: '/dicoms/brain.jpg', name: 'image6.dcm' },
    { src: '/dicoms/brain.jpg', name: 'image7.dcm' },
    { src: '/dicoms/brain.jpg', name: 'image8.dcm' },
    { src: '/dicoms/brain.jpg', name: 'image9.dcm' },
    { src: '/dicoms/brain.jpg', name: 'image10.dcm' },
    { src: '/dicoms/brain.jpg', name: 'image11.dcm' },
  ];
  return (
    <div>
      <MediaGrid dicomImages={dicomImages}/>
    </div>
  )
}