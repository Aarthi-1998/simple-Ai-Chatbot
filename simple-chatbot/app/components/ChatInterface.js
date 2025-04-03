"use client";
import { useState } from "react";
import OpenAI from "openai";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function ChatInterface({ messages, setMessages, setChatHistory }) {
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage.text }],
      });

      const botReply = { text: response.choices[0].message.content, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botReply]);

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { conversation: [...messages, userMessage, botReply] },
      ]);
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 429) {
        alert("OpenAI API quota exceeded. Please check your billing details.");
      }
    }
  }

  return (
    <div className="w-[750px] ml-[150px] flex flex-col bg-white shadow-lg">
      {/* Top Header */}
      <div className="bg-black text-white flex items-center p-4">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
          <span className="text-blue-600 text-lg font-bold">🤖</span>
        </div>
        <div>
          <h2 className="text-lg font-bold">ChatBot</h2>
          <p className="text-sm opacity-80">🟢 Online</p>
        </div>
        
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4 h-[70vh] custom-scrollbar">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">Start a conversation...</p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`p-3 m-2 max-w-[75%] rounded-xl text-black ${
                  msg.sender === "user" ? "bg-gray-200 text-black" : "bg-neutral-600"
                }`}
              >
                <p>{msg.text}</p>
                <div className="text-xs opacity-80 mt-1 flex justify-between">
                  {msg.sender === "user" }
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t bg-white flex">
        <input
          className="flex-grow p-2 border rounded-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
        />
        <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
