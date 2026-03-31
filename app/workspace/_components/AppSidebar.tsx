"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { Progress } from "@/components/ui/progress";
import { UserButton } from "@clerk/nextjs";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

export function AppSidebar() {
  const [projectList, setProjectList] = useState<any[]>([]);
  const { userDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetProjectList();
  }, []);

  const GetProjectList = async () => {
    try {
      setLoading(true);

      const result = await axios.get("/api/get-all-projects");
      console.log("projects api:", result.data);

      const projects = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.data?.projects)
          ? result.data.projects
          : [];

      setProjectList(projects);
    } catch (error) {
      console.log(error);
      setProjectList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-5">
        <div className="flex items-center gap-2">
          <Image src={"/logo.svg"} alt="logo" width={35} height={35} />
          <h2 className="font-bold text-xl">AI Website Builder</h2>
        </div>

        <Link href={"/workspace"} className="mt-5 w-full">
          <Button className="w-full">+ Add New Project</Button>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>Projects</SidebarGroupContent>

          {!loading && projectList.length === 0 && (
            <h2 className="text-sm text-gray-500">No project found</h2>
          )}

          <div>
            {loading
              ? [1, 2, 3, 4, 5].map((_, index) => (
                  <Skeleton
                    key={index}
                    className="w-full h-10 rounded-lg mt-2"
                  />
                ))
              : projectList.map((project: any) => (
                  <Link
                    href={`/playground/${project.projectId}?frameId=${project.frameId}`}
                    key={project.projectId}
                    className="my-2 hover:bg-secondary p-2 rounded-lg cursor-pointer block"
                  >
                    <h2 className="line-clamp-1">
                      {project?.chats?.[0]?.chatMessage?.[0]?.content ||
                        "Untitled Project"}
                    </h2>
                  </Link>
                ))}
          </div>
        </SidebarGroup>

        <SidebarGroup />
      </SidebarContent>

      <SidebarFooter />
      <SidebarFooter className="p-2">
        <div className="p-3 border rounded-xl space-y-3 bg-secondary">
          <h2 className="flex justify-between items-center">
            Remaining Credits
            <span className="font-bold">{userDetail?.credits}</span>
          </h2>
          <Progress value={33} />
          <Button className="w-full">Upgrade to Unlimited</Button>
        </div>

        <div className="flex items-center gap-2">
          <UserButton />
          <Button variant={"ghost"}>Settings</Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}