"use client";
import React, { useEffect, useState } from "react";
import PlaygroundHeader from "../_components/PlaygroundHeader";
import ChatSection from "../_components/ChatSection";
import WebsiteDesign from "../_components/WebsiteDesign";
import ElementSettingSection from "../_components/ElementSettingSection";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

export type Frame = {
  projectId: string;
  frameId: string;
  designCode: string;
  chatMessages: Messages[];
};

export type Messages = {
  role: string;
  content: string;
};

const Prompt = `userInput: {userInput}

Based on the user input, generate complete HTML + Tailwind CSS code using Flowbite UI components. Use a modern design with blue as the primary theme color.

Do not add HTML <head> or <title> tags. Only return the <body>. Make it fully responsive.

Requirements:
- All primary components must match the theme color.
- Add proper padding and margin for each element.
- Components should not be connected to one another; each element should be independent.
- Design must be fully responsive for all screen sizes.
- Use placeholders for all images.

For light mode images use:
https://placehold.co/600x400/f3f4f6/111827?text=Placeholder+Image

For dark mode images use:
https://placehold.co/600x400/1f2937/ffffff?text=Placeholder+Image

For every image, add an alt tag describing the image prompt.

- Do not include broken links.
- Libraries are already installed, so do not install them or add script tags.
- Header menu options should be spaced out and not connected.

Use the following libraries/components where appropriate:
- Font Awesome icons
- Flowbite for UI components such as buttons, modals, forms, tables, tabs, alerts, cards, dialogs, dropdowns, etc.
- Chart.js for charts and graphs
- Swiper.js for sliders and carousels
- Tippy.js for tooltips and popovers

Additional requirements:
- Ensure proper spacing, alignment, and visual hierarchy for all elements.
- Include interactive components such as modals, dropdowns, and accordions where suitable.
- Ensure charts are visually appealing and match the theme color.
- Do not add any extra text before or after the HTML code.
- Output a complete, ready-to-use HTML page.

Do not include any raw text before or after the HTML output. The response must contain only the HTML code.
Wrap the final output inside a \`\`\`html code block and do not include any explanation outside the code block.


`;

function PlayGround() {
  const { projectId } = useParams();
  const params = useSearchParams();
  const frameId = params.get("frameId");
  const [frameDetail, setFrameDetail] = useState<Frame>();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Messages[]>([]);
  const [generatedCode, setGeneratedCode] = useState("");

  useEffect(() => {
    GetFrameDetails();
  }, [frameId]);

  const GetFrameDetails = async () => {
    const result = await axios.get(
      "/api/frames?frameId=" + frameId + "&projectId=" + projectId,
    );
    console.log(result.data);
    setFrameDetail(result.data);

    const designCode = result.data?.designCode;

    if (designCode) {
      const formattedCode = designCode
        .replaceAll("```html", "")
        .replaceAll("```", "")
        .replace("html", "")
        .trim();

      setGeneratedCode(formattedCode);
    } else {
      setGeneratedCode("");
    }

    if (result.data?.chatMessages?.length == 1) {
      const userMsg = result.data.chatMessages[0].content;
      SendMessage(userMsg);
    } else {
      setMessages(result.data?.chatMessages);
    }
  };

  const SendMessage = async (userInput: string) => {
    setLoading(true);

    //Add user mesage to chat

    setMessages((prev: any) => [...prev, { role: "user", content: userInput }]);

    const result = await fetch("/api/ai-model", {
      method: "POST",
      body: JSON.stringify({
        messages: [
          { role: "user", content: Prompt?.replace("{userInput}", userInput) },
        ], //Pass Prompt
      }),
    });

    const reader = result.body?.getReader();
    const decoder = new TextDecoder();
    let aiResponse = "";
    let isCode = false;

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      aiResponse += chunk;
      //Check if AI start sending code
      if (!isCode && aiResponse.includes("```html")) {
        isCode = true;
        const index = aiResponse.indexOf("```html") + 7;
        const initialCodeChunk = aiResponse.slice(index);
        setGeneratedCode((prev: any) => prev + initialCodeChunk);
      } else if (isCode) {
        setGeneratedCode((prev: any) => prev + chunk);
      }
    }

    await SaveGeneratedCode(aiResponse);
    //After Streaming ends
    setMessages((prev: any) => [
      ...prev,
      { role: "assistant", content: "Your code is ready!" },
    ]);

    setLoading(false);
  };

  useEffect(() => {
    if (messages.length > 0) {
      SaveMesaages();
    }
  }, [messages]);

  const SaveMesaages = async () => {
    const resut = axios.put("/api/chats", {
      messages: messages,
      frameId: frameId,
    });
    console.log(resut);
  };

  const SaveGeneratedCode = async (code: string) => {
    const result = await axios.put("/api/frames", {
      designCode: code,
      frameId: frameId,
      projectId: projectId,
    });
    console.log(result);
    toast.success("Website is ready!");
  };

  return (
    <div>
      <PlaygroundHeader />
      <div className="flex">
        {/* ChatSection */}
        <ChatSection
          messages={messages ?? []}
          onSend={(input: string) => SendMessage(input)}
          loading={loading}
        />
        {/* WebsiteDesign */}
        <WebsiteDesign generatedCode={generatedCode} />
        
      </div>
    </div>
  );
}

export default PlayGround;
