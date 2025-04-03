"use client";
import { useState } from "react";
import ChatHistory from "../components/ChatHistory";
import ChatInterface from "../components/ChatInterface";

export default function Chat() {
  const [chatHistory, setChatHistory] = useState([]);
  const [messages, setMessages] = useState([]);

  function addChatHistory(conversation) {
    setChatHistory((prev) => [...prev, { conversation }]);
  }

  return (
    <div className="flex w-full h-screen bg-gray-100">
      {/* Left Panel (Chat History) */}
      <ChatHistory chatHistory={chatHistory} onSelectChat={() => {}} />

      {/* Right Panel (Chat Interface) */}
      <ChatInterface
        messages={messages} //  Pass messages as a prop
        setMessages={setMessages} // Pass setMessages as a prop
        setChatHistory={setChatHistory}
      />
    </div>
  );
}
