import { NextRequest } from "next/server";
import { db } from "@/config/db";
import {
  frameTable,
  projectTable,
  chatTable,
  usersTable,
} from "@/config/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { projectId, frameId, messages, credits } = await req.json();
  const user = await currentUser();
  const { has } = await auth();
  const hasUnlimitedAccess = has && has({ plan: "unlimited" });

  const project = await db.insert(projectTable).values({
    projectId: projectId,
    createdBy: user?.primaryEmailAddress?.emailAddress,
  });

  const frameResult = await db.insert(frameTable).values({
    frameId: frameId,
    projectId: projectId,
  });

  const chatResult = await db.insert(chatTable).values({
    chatMessage: messages,
    createdBy: user?.primaryEmailAddress?.emailAddress,
    frameId: frameId,
  });

  if (!hasUnlimitedAccess) {
    await db
      .update(usersTable)
      .set({
        credits: credits - 1,
      })
      //@ts-ignore
      .where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress!));
  }

  return NextResponse.json({ project, frameResult, chatResult });
}