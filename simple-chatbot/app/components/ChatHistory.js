import { Plus } from "lucide-react";

export default function ChatHistory({ chatHistory = [], onSelectChat, onNewChat }) {
  return (
    <div className="w-[250px] h-screen p-4  overflow-y-auto bg-gray-200 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg text-black font-semibold">Chat History</h2>
        <button
          onClick={onNewChat}
          className="p-1 bg-white text-black rounded-full "
          title="Start New Chat"
        >
          <Plus size={18} />
        </button>
      </div>

      {chatHistory.length === 0 ? (
        <p className="text-black">No chat history yet</p>
      ) : (
        chatHistory.map((chat, index) => (
          <div
            key={index}
            className="p-2 cursor-pointer"
            onClick={() => onSelectChat(chat)}
          >
            {chat.conversation.length > 0 && (
              <p className="truncate">{chat.conversation[0].text}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
