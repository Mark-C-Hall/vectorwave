import type { Conversation } from "@prisma/client";
import { UserButton, useUser } from "@clerk/nextjs";

import ChatItem from "./ChatItem";

interface Props {
  conversations: Conversation[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ChatList({
  conversations: chats,
  onEdit,
  onDelete,
}: Props) {
  const { user } = useUser();
  return (
    <aside className="flex h-screen w-[260px] flex-col items-center bg-black p-4">
      <button className="mb-14 mt-5 flex items-center justify-center rounded border border-white bg-black px-4 py-2 text-base text-white hover:bg-gray-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="mr-1 inline-block h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        New Chat
      </button>
      <div className="scrollbar scrollbar-thumb-gray-500 scrollbar-track-gray-100 flex-grow overflow-auto">
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            onEdit={() => onEdit(chat.id)}
            onDelete={() => onDelete(chat.id)}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <UserButton afterSignOutUrl="/auth/login" />
        <p className="p-4">{user?.fullName}</p>
      </div>
    </aside>
  );
}
