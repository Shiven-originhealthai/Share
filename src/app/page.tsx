import Image from "next/image";
import MediaGrid from "@/components/MediaGrid";
import Navbar from "@/components/Navbar";
import MediaGridServer from "../components/MediaGridServer";
/*const dicomImages = [
  { src: '/dicoms/brain.jpg', name: 'image1.dcm' },
  { src: '/dicoms/brain.jpg', name: 'image2.dcm' },
  { src: '/dicoms/brain.jpg', name: 'image3.dcm' },
  { src: '/dicoms/brain.jpg', name: 'image4.dcm' },
  { src: '/dicoms/brain.jpg', name: 'image5.dcm' },
  { src: '/dicoms/brain.jpg', name: 'image6.dcm' },
  { src: '/dicoms/brain.jpg', name: 'image7.dcm' },
  { src: '/dicoms/brain.jpg', name: 'image8.dcm' },
  { src: '/dicoms/brain.jpg', name: 'image9.dcm' },
];*/

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col ">
      <div className="flex-1 overflow-y-auto pt-0 bg-blue-1000">
        <MediaGridServer/>
      </div>
    </div>
  );
}
