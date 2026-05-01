import React, { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OnSaveContext } from "@/context/OnSaveContext";

function PlaygroundHeader() {
  const {onSaveData, setOnSaveData}=useContext(OnSaveContext)
  return (
    <div className="flex justify-between items-center p-4 shadow bg-[#07111f] border-b border-slate-800">
      <Link href="/" className="ml-1"><Image src={"/logo1.svg"} alt="logo" width={24} height={24} /></Link>
      <Button onClick={()=>setOnSaveData(Date.now())}>save</Button>
    </div>
  );
}

export default PlaygroundHeader;
