import { NextRequest } from "next/server";
import { db } from "@/config/db";
import { frameTable, projectTable,chatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { projectId, frameId, messages }= await req.json();
    const user = await currentUser();
  //Create Project
    const project = await db.insert(projectTable).values({
    projectID:projectId,
    createdBy:user?.primaryEmailAddress?.emailAddress
    })
  //Create Frame
    const frameResult = await db.insert(frameTable).values({
    frameId: frameId,
    projectID: projectId,
})

  //Save User MSg
    const chatResult = await db.insert(chatTable).values({
        chatMessage: messages,
        createdBy: user?.primaryEmailAddress?.emailAddress
    })

    return NextResponse.json({ project, frameResult, chatResult });
}
