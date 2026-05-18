import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
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
      <Link href="/" className="flex items-center gap-2">
        <Image src={"/logo1.svg"} alt="logo" width={24} height={24} className="ml-1" />
        <h2 className="font-bold text-xl">AI Website Generator</h2>
      </Link>

      <div className="flex items-center gap-0">
        {MenuOptions.map((menu, index) => (
          <Link href={menu.path} key={index}>
            <Button variant="ghost">{menu.name}</Button>
          </Link>
        ))}

        <div className="ml-3">
          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/workspace">
              <Button>
                Get Started <ArrowRight />
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/workspace">
              <Button>
                Open Workspace <ArrowRight />
              </Button>
            </Link>
          </SignedIn>
        </div>
      </div>
    </div>
  );
}

export default Header;