"use client";
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dynamic from "next/dynamic";

const FileUpload = dynamic(() => import("./FileUpload"), {
  ssr: false,
});

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export default function ChatInterface({ messages, setMessages }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileData, setFileData] = useState(null);

  async function sendMessage(messageText) {
    if (!messageText.trim() && !fileData) return;

    const composedText = fileData
      ? `${messageText}\n\n📎 ${fileData.name}\n\n${fileData.text}`
      : messageText;

    const userMessage = {
      text: fileData ? `📎 ${fileData.name}\n\n${messageText}` : messageText,
      sender: "user",
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setFileData(null);
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(composedText);
      const response = await result.response;
      const botReply = {
        text: response.text(),
        sender: "bot",
      };
      setMessages([...newMessages, botReply]);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full flex flex-col bg-gray-100 shadow-lg">
      {/* Header */}
      <div className="bg-gray-200 text-white flex items-center p-4">
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center mr-3">
          <span className="text-black text-lg font-bold">🤖</span>
        </div>
        <div>
          <h2 className="text-lg text-black font-bold">ChatBot</h2>
          <p className="text-sm text-black opacity-80">🟢 Online</p>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-grow overflow-y-auto p-4 h-[70vh] custom-scrollbar">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">Start a conversation...</p>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 m-2 rounded-xl break-words whitespace-pre-wrap text-black ${
                  msg.sender === "user"
                    ? "bg-gray-200 text-black"
                    : "bg-neutral-600 text-white"
                } max-w-[75%] w-fit`}
              >
                <p>{msg.text}</p>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="p-3 m-2 rounded-xl bg-neutral-600 text-white">
              <p>🤖 Thinking...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input & Upload */}
      <div className="p-4 border-t bg-white gap-3 flex items-center">
        <input
          className="flex w-[1000px] p-2 border rounded-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Type your message here..."
        />
        <FileUpload
          onFileSelect={(file) => setFileData(file)}
          fileData={fileData}
          onRemoveFile={() => setFileData(null)}
        />
        <button
          className="px-4 py-2 bg-black text-white rounded-lg"
          onClick={() => sendMessage(input)}
        >
          Send
        </button>
      </div>
    </div>
  );
}
