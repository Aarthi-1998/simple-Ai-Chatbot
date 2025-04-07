"use client";
import { useState } from "react";
import ChatHistory from "../components/ChatHistory";
import ChatInterface from "../components/ChatInterface";
import { Maximize2, Minimize2, Smartphone } from "lucide-react";

export default function Chat() {
  const [chatHistory, setChatHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [screenType, setScreenType] = useState("full");

  const startNewChat = () => {
    if (messages.length > 0) {
      setChatHistory((prev) => [...prev, { conversation: [...messages] }]);
    }
    setMessages([]);
  };

  const ToggleScreenType = () => {
    setScreenType((prev) => {
      if (prev === "full") return "tablet";
      if (prev === "tablet") return "mobile";
      return "full";
    });
  };

  const getChatWidth = () => {
    switch (screenType) {
      case "tablet":
        return "w-[700px]";
      case "mobile":
        return "w-[375px]";
      default:
        return "w-full";
    }
  };

  const getIcon = () => {
    if (screenType === "full") return <Minimize2 />;
    if (screenType === "tablet") return <Smartphone />;
    return <Maximize2 />;
  };

  return (
    <div className="relative flex w-full h-screen bg-gray-100 overflow-hidden">
      <button
        onClick={ToggleScreenType}
        className="absolute top-2 right-4 p-2 bg-black text-white rounded-full shadow hover:bg-gray-700 z-10"
        title="Screen Size"
      >
        {getIcon()}
      </button>

      {/* 📋 Left Panel with New Chat Button */}
      <div className=" h-full bg-white shadow-md">
        <ChatHistory chatHistory={chatHistory} onSelectChat={() => {}} onNewChat={startNewChat} />
      </div>

      {/* 💬 Right Panel */}
      <div className="flex w-3/4 h-full flex-1 justify-center  bg-gray-100  ">
        <div className={` h-full bg-white shadow-lg rounded-lg ${getChatWidth()}`}>
          <ChatInterface
            messages={messages}
            setMessages={setMessages}
          />
        </div>
      </div>
    </div>
  );
}
