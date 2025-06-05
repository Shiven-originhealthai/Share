import { NextResponse } from "next/server";
export async function POST(req : Request){
    const body = await req.json()
    const {arr} = body;
    console.log(body);
    const externalapicall = await fetch('http://localhost:3001/images',{
        method:'POST',
        headers:{
            'content-type':'Application/json'
        },
        body:JSON.stringify({arr})

});
if(!externalapicall.ok){
    console.log('api call failed')
}
else{
    const externaldata = await externalapicall.json();
    const shareurl = externaldata.shareurl;
    const qrcodeurl = externaldata.qrcodeurl;
    return NextResponse.json({shareurl:shareurl,qrcodeurl:qrcodeurl})

}

}