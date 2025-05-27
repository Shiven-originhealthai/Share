"use client"
import react,{use, useEffect,useState} from "react";
import MediaCard from './MediaCard';
import {getMedialList} from "@/lib/api";
import {MediaItem} from "@/types/media";

type Props={
        selectedIds:string[];
        toggleselect:(id:string)=>void
}
export default function MediaGrid({selectedIds,toggleselect}:Props){
    const[media,setMedia] = useState<MediaItem[]>([]);
    useEffect(()=>{
        const fetchMedia=async()=>{
                const data = await getMedialList();
                setMedia(data);
        };
        fetchMedia();
    },[]);
    return(
        <div className="gri grid-cols-2 md:grid-cols-4 gap-4 p-6">
            {media.map((item)=>(
                <MediaCard key={item.id}
                media={item}
                isselected={selectedIds.includes(item.id)}
                toggleselect={toggleselect}/>
            ))}

        </div>
    )

}