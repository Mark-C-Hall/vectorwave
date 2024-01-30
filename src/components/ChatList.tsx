import type { Conversation } from "@prisma/client";

import ChatItem from "./ChatItem";

interface Props {
  chats: Conversation[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ChatList({ chats, onEdit, onDelete }: Props) {
  return (
    <aside className="flex h-screen w-[260px] flex-col items-center bg-black p-4">
      <h2 className="mb-4 text-xl font-semibold text-white">Chats</h2>
      <button className="mb-4 rounded border border-white bg-black px-4 py-2 text-sm text-white hover:bg-gray-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500">
        New Chat
      </button>
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          onEdit={() => onEdit(chat.id)}
          onDelete={() => onDelete(chat.id)}
        />
      ))}
    </aside>
  );
}
