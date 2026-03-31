"use client";

import React, { useEffect, useRef, useState } from "react";
import WebPageTools from "./WebPageTools";
import ElementSettingSection from "./ElementSettingSection";
import ImageSettingSection from "./ImageSettingsSection";
import { useParams, useSearchParams } from "next/navigation";
import { OnSaveContext } from "@/context/OnSaveContext";
import { useContext } from "react";
import axios from "axios";
import { toast } from "sonner";

type Props = {
  generatedCode: string;
};

const HTML_CODE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>AI Website Builder</title>

  <script src="https://cdn.tailwindcss.com"></script>

  <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet"/>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body id="root"></body>
</html>
`;

function WebsiteDesign({ generatedCode }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedScreenSize, setSelectedScreenSize] = useState("web");
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>();
  const { onSaveData, setOnSaveData } = useContext(OnSaveContext);
  const { projectId } = useParams();
  const params = useSearchParams();
  const frameId = params.get("frameId");

  const cleanGeneratedCode = (code: string) => {
    return (
      code
        ?.replace(/```html/g, "")
        .replace(/```/g, "")
        .replace(/<!DOCTYPE html>/gi, "")
        .replace(/<html[^>]*>/gi, "")
        .replace(/<\/html>/gi, "")
        .replace(/<head[\s\S]*?<\/head>/gi, "")
        .replace(/<body[^>]*>/gi, "")
        .replace(/<\/body>/gi, "")
        .trim() ?? ""
    );
  };

  useEffect(() => {
    if (!iframeRef.current) return;

    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(HTML_CODE);
    doc.close();

    console.log("iframe initialized");

    let hoverEl: HTMLElement | null = null;
    let selectedEl: HTMLElement | null = null;

    const clearHover = () => {
      if (hoverEl && hoverEl !== selectedEl) {
        hoverEl.style.outline = "";
      }
      hoverEl = null;
    };

    const clearSelected = () => {
      if (selectedEl) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
      }
      selectedEl = null;
    };

    const handleMouseOver = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      if (
        target.id === "root" ||
        target.tagName === "BODY" ||
        target.tagName === "HTML"
      )
        return;
      if (selectedEl) return;

      clearHover();
      hoverEl = target;
      hoverEl.style.outline = "2px dotted blue";

      console.log("hover:", hoverEl.tagName, hoverEl.className);
    };

    const handleMouseOut = () => {
      if (selectedEl) return;
      clearHover();
    };

    const handleClick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target as HTMLElement;
      if (!target) return;
      if (
        target.id === "root" ||
        target.tagName === "BODY" ||
        target.tagName === "HTML"
      )
        return;

      console.log("clicked:", target.tagName, target.className, target);

      clearHover();

      if (selectedEl && selectedEl !== target) {
        clearSelected();
      }

      selectedEl = target;
      selectedEl.style.outline = "2px solid red";

      const editableTags = [
        "H1",
        "H2",
        "H3",
        "H4",
        "H5",
        "H6",
        "P",
        "SPAN",
        "A",
        "BUTTON",
        "LI",
      ];
      if (editableTags.includes(selectedEl.tagName)) {
        selectedEl.setAttribute("contenteditable", "true");
        selectedEl.focus();
      }

      setSelectedElement(selectedEl);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearSelected();
      }
    };

    doc.addEventListener("mouseover", handleMouseOver, true);
    doc.addEventListener("mouseout", handleMouseOut, true);
    doc.addEventListener("click", handleClick, true);
    doc.addEventListener("keydown", handleKeyDown);

    return () => {
      doc.removeEventListener("mouseover", handleMouseOver, true);
      doc.removeEventListener("mouseout", handleMouseOut, true);
      doc.removeEventListener("click", handleClick, true);
      doc.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!iframeRef.current) return;

    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    const root = doc.getElementById("root");
    if (!root) return;

    root.innerHTML = cleanGeneratedCode(generatedCode);
    console.log("code injected");
  }, [generatedCode]);

  useEffect(() => {
    onSaveData && onSaveCode();
  }, [onSaveData]);

  const onSaveCode = async() => {
    if (iframeRef.current) {
      try {
        const iframeDoc =
          iframeRef.current.contentDocument ||
          iframeRef.current.contentWindow?.document;
        if (iframeDoc) {
          const cloneDoc = iframeDoc.documentElement.cloneNode(
            true,
          ) as HTMLElement;
          //Remove All Outlines
          const AllEls = cloneDoc.querySelectorAll<HTMLElement>("*");
          AllEls.forEach((el) => {
            el.style.outline = "";
            el.style.cursor = "";
          });

          const html = cloneDoc.outerHTML;
          console.log("HTML to save", html);

          const result = await axios.put("/api/frames", {
            designCode: html,
            frameId: frameId,
            projectId: projectId,
          });
          console.log(result);
          toast.success("Saved!");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="flex gap-2 w-full">
      <div className="p-5 flex-1 flex flex-col items-center">
        <iframe
          ref={iframeRef}
          className={`${selectedScreenSize === "web" ? "w-full" : "w-80"} h-[79vh] border-2 rounded-xl`}
          sandbox="allow-scripts allow-same-origin"
        />
        <WebPageTools
          selectedScreenSize={selectedScreenSize}
          setSelectedScreenSize={(v: string) => setSelectedScreenSize(v)}
          generatedCode={generatedCode}
        />
      </div>
      {/* Setting section */}
      {/* @ts-ignore */}
      {/* <ElementSettingSection selectedEl={selectedElement} clearSelection={()=>setSelectedElement(null)}/> */}
      {selectedElement?.tagName == "IMG" ? (
        //@ts-ignore
        <ImageSettingSection selectedEl={selectedElement} />
      ) : selectedElement ? (
        <ElementSettingSection
          selectedEl={selectedElement}
          clearSelection={() => setSelectedElement(null)}
        />
      ) : null}
    </div>
  );
}

export default WebsiteDesign;
