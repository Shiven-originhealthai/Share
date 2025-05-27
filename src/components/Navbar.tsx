"use client"
import React from "react";
/*type NavbarProps = {
    onShare:() => boolean;
};*/
/*{onShare}:NavbarProps*/
function onShare(){
    console.log('sharing');
}
export default function Navbar() {
    return (
        <nav className=" w-full bg-blue-900 text-white px-6 py-4 flex flex-row justify-between items-center">
            <h1 className="text-xl font-bold px-12">Sonio Share</h1>
            <div className="flex flex-row space x-6 justify-center items-center" >
                <p className="px-10 text-xl font-bold"> JOHN DOE</p>
                <p className="px-2 text-xl font-bold">Date of Birth : 11-08-2003</p>
                <p className="px-15 text-xl  font-bold">Age : 24</p>
            </div>
            <button
            onClick={onShare}
            className="bg-blue-700 text-white-600 px-4 py-3 rounded shadow">
                Share Selected
            </button>
        </nav>
    );
}