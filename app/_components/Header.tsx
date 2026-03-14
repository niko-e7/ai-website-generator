import React from "react";
import Image from "next/image";
import path from "path";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";


const MenuOptions = [
  {
    name: "Pricing",
    path: "/pricing",
  },
  {
    name: "Contact us",
    path: "/contact-us",
  },
];

function Header() {
  return (
    <div className="flex items-center justify-between p-4 shadow">
      {/* Logo x */}
      <div className="flex gap-2 items-center">
        <Image src={"/logo.svg"} alt="logo" width={35} height={35} />
        <h2 className="font-bold text-xl">AI Website Generator</h2>
      </div>
      {/* Menu Options */}
      <div className="flex gap-3">
        {MenuOptions.map((menu, index) => (
          <Button variant={"ghost"} key={index}>
            {menu.name}
          </Button>
        ))}
      </div>

      {/* Get Started Button */}
      <div>
        <SignInButton mode="modal" forceRedirectUrl={"/workspace"}>
         
        <Link href={'/workspace'}>
         
          <Button>
            Get Started <ArrowRight />
          </Button>
          </Link>
        </SignInButton>
      </div>
    </div>
  );
}

export default Header;
