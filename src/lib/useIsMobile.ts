import { useEffect,useState } from "react";
export default function useIsMobile(){
        const [isMobile,setIsMobile] = useState(false);
        useEffect(()=>{
            const userAgent = typeof navigator ==="undefined" ? "" : navigator.userAgent;
            const isMobileDevice  = /android|iphone|ipad|ipod|blackberry|iemmobile|operamini/i.test(
                userAgent.toLowerCase()
            );
            setIsMobile(isMobileDevice);
        },[])

        return isMobile
}