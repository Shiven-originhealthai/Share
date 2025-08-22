import { useEffect,useState } from "react";
export default function useIsMobile(){
        const [isMobile,setIsMobile] = useState(false);
        useEffect(()=>{
            const userAgent = typeof navigator ==="undefined" ? "" : navigator.userAgent;
            const isMobileDevice  = /android|iphone|ipad|ipod|/i.test(
                userAgent.toLowerCase()
            );
            setIsMobile(isMobileDevice);
            console.log(navigator.userAgent)
        },[])

        return isMobile
}