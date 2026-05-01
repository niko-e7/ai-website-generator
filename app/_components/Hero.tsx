"use client";

import { v4 as uuidv4 } from "uuid";
import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import {
  ArrowUp,
  HomeIcon,
  Key,
  LayoutDashboard,
  Loader2Icon,
  User,
} from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";

const suggestions = [
  {
    label: "Dashboard",
    prompt:
      "Create an analytics dashboard to track customers and revenue data for a SaaS ",
    icon: LayoutDashboard,
  },
  {
    label: "SignUp Form",
    prompt:
      "Create a modern sign up form with email/password fields, Google and Github login options, and terms checkbox ",
    icon: Key,
  },
  {
    label: "Hero",
    prompt:
      "Create a modern header and centered hero section for a productivity SaaS. Include a badge for feature announcement, a title with a subtle gradient effect",
    icon: HomeIcon,
  },
  {
    label: "User PRofile Card",
    prompt:
      "Create a modern user profile card component for a social media website ",
    icon: User,
  },
];

function Hero() {
  const [userInput, setUserInput] = useState<string>();
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {has} = useAuth()
  const {userDetail,setUserDetail} = useContext(UserDetailContext);
   const hasUnlimitedAccess = has&&has({ plan: 'unlimited' })

  const CreateNewProject = async () => {

    if(!hasUnlimitedAccess && userDetail?.credits! <= 0){
      toast.error("Yoi have no credits left. Please upgrade your plan.")
      return;
    }

    setLoading(true);
    const projectId = uuidv4();
    const frameId = generateRandomFrameNumber();
    const messages = [
      {
        role: "user",
        content: userInput,
      },
    ];
    try {
      const result = await axios.post("/api/projects", {
        projectId: projectId,
        frameId: frameId,
        messages: messages,
        credits:userDetail?.credits
      });
      console.log(result.data);
      toast.success("Project Created!");
      //Navigate to Playground
      router.push(`/playground/${projectId}?frameId=${frameId}`);
      setUserDetail((prev:any)=>({
        ...prev
        ,credits: prev?.credits!-1
      }))
      ;
      setLoading(false);
    } catch (e) {
      toast.error("Internal Server Error");
      console.log(e);
    }
  };

  return (
    <div className="flex flex-col items-center h-[80vh] justify-center">
      {/* Header & description */}
      <h2 className="font-bold text-6xl text-slate-100">What should we design?</h2>
      <p className="mt-2 text-xl text-slate-400">
        Generate, Edit and Explore design with AI, Export code as well
      </p>
      {/* input box */}
      <div className="w-full max-w-2xl p-5 border border-slate-700 bg-slate-900 mt-5 rounded-2xl">
        <textarea
          placeholder="Describe your page design"
          value={userInput}
          onChange={(event) => setUserInput(event.target.value)}
          className="w-full h-24 focus:outline-none focus:ring-0 resize-none bg-transparent text-slate-100 placeholder:text-slate-500"
        />

        <div className="flex justify-end items-center">
          <SignInButton mode="modal" forceRedirectUrl={"/workspace"}>
            <Button disabled={!userInput || loading} onClick={CreateNewProject}>
              {loading?<Loader2Icon className="animate-spin"/>:<ArrowUp />}
            </Button>
          </SignInButton>
        </div>
      </div>
      {/* suggestion list */}
      <div className="mt-4 flex gap-3">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant={"outline"}
            onClick={() => setUserInput(suggestion.prompt)}
          >
            <suggestion.icon />
            {suggestion.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default Hero;

const generateRandomFrameNumber = () => {
  const randomNumber = Math.floor(Math.random() * 10000);
  return randomNumber;
};
