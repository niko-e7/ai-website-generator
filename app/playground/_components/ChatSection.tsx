import React, { useState } from "react";
import { Messages } from "../[projectId]/page";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  messages: Messages[]
  onSend: any,
  loading: boolean
};

function ChatSection({ messages, onSend,loading }: Props) {
  const [input, setInput] = useState<string>();

  const handleSendMessage = () => {
    if (!input?.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="w-96 shadow h-[91vh] p-4 flex flex-col bg-slate-900 border-r border-slate-700">
      ChatSection
      {/* Message Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
        {messages?.length === 0 ? (
          <p className="text-slate-400 text-center"> No messages yet</p>
        ) : (
          messages?.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} `}
            >
              <div
                className={`p-2 rounded-lg max-w-[80%] ${msg.role === "user" ? "bg-[#00006f] text-white" : "bg-slate-800 text-slate-100"}`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}

        {loading && <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-indigo-400">Thinkig... Working on your request</span>
        </div>}
      </div>
      {/* Footer Input  */}
      <div className="p-3 border-t border-slate-700 flex items-center gap-2">
        <textarea
          value={input}
          placeholder="Describe your website design idea"
          className="flex-1 resize-none border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-800 text-slate-100 placeholder:text-slate-500"
          onChange={(event) => setInput(event.target.value)}
        />
        <Button onClick={handleSendMessage}>
          <ArrowUp />
        </Button>
      </div>
    </div>
  );
}

export default ChatSection;
