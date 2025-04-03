export default function ChatHistory({ chatHistory = [], onSelectChat }) {
    return (
      <div className="w-[250px] h-screen p-4 border-r overflow-y-auto bg-white">
        <h2 className="text-lg font-semibold mb-4">Chat History</h2>
        {chatHistory.length === 0 ? (
          <p className="text-gray-500">No chat history yet</p>
        ) : (
          chatHistory.map((chat, index) => (
            <div key={index} className="p-2 cursor-pointer" onClick={() => onSelectChat(chat)}>
              {chat.conversation.length > 0 && (
                <p className="truncate">{chat.conversation[0].text}</p>
              )}
            </div>
          ))
        )}
      </div>
    );
  }
  