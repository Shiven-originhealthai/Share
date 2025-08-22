import MediaGridServer from "../components/MediaGridServer";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col ">
      
      <div className="flex-1 overflow-y-auto pt-0 bg-blue-1000">
        <MediaGridServer/>
      </div>
    </div>
  );
}
