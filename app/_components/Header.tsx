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
    path: "/workspace/pricing",
  },
  {
    name: "Contact us",
    path: "/contact-us",
  },
];

function Header() {
  return (
    <div className="flex items-center justify-between p-4 shadow bg-[#07111f] border-b border-slate-800">
      {/* Logo x */}
      <Link href="/" className="flex items-center gap-2">
        <Image src={"/logo1.svg"} alt="logo" width={24} height={24} className="ml-1" />
        <h2 className="font-bold text-xl">AI Website Generator</h2>
      </Link>
      {/* Nav links + CTA */}
      <div className="flex items-center gap-6">
        {MenuOptions.map((menu, index) => (
          <Link href={menu.path} key={index}>
            <Button variant={"ghost"}>{menu.name}</Button>
          </Link>
        ))}
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
