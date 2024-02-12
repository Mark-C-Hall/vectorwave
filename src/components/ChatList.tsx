import type { Conversation } from "@prisma/client";
import { UserButton, useUser } from "@clerk/nextjs";
import { useState } from "react";

import ChatItem from "./ChatItem";
import NewChatModal from "./NewChatModal";
import EditChatTitleModal from "./EditChatModal";
import DeleteConfirmation from "./DeleteConfirmation";

interface Props {
  conversations: Conversation[];
}

export default function ChatList({ conversations: initialChats }: Props) {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [chatToDelete, setChatToDelete] = useState<Conversation | null>(null);
  const [chats, setChats] = useState(initialChats);

  function handleNewChatButtonClick() {
    setIsModalOpen(true);
  }

  function handleModalClose() {
    setIsModalOpen(false);
  }

  function handleCreateChat(title: string) {
    console.log(`Creating new chat with title: ${title}`);
    // Here you can call your API to create a new chat
    const newChat = {
      id: Math.random().toString(36).substring(7),
      userId: user?.id ?? "",
      title,
    };
    const updatedChats = [...chats, newChat];
    setChats(updatedChats);
    setIsModalOpen(false);
  }

  function handleEdit(newTitle: string) {
    console.log(`Editing chat title to: ${newTitle}`);
    // Find the chat in the chats array and update its title
    const updatedChats = chats.map((chat) =>
      chat.id === selectedChat!.id ? { ...chat, title: newTitle } : chat,
    );
    // Here you can call your API to update the chat title
    // Update the state with the new chats array
    setChats(updatedChats);
    setSelectedChat(null);
  }

  function handleDeleteChat(id: string) {
    console.log(`Deleting chat with id: ${id}`);
    // Here you can call your API to delete the chat
    const updatedChats = chats.filter((chat) => chat.id !== id);
    setChats(updatedChats);
    setIsDeleteModalOpen(false); // Close the delete confirmation modal
  }

  function promptDeleteChat(chat: Conversation) {
    setChatToDelete(chat);
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  }

  return (
    <aside className="flex h-screen w-[260px] flex-col items-center bg-black p-4">
      <button
        onClick={handleNewChatButtonClick}
        className="mb-14 mt-5 flex items-center justify-center rounded border border-white bg-black px-4 py-2 text-base text-white hover:bg-gray-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
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
      <NewChatModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onCreate={handleCreateChat}
      />
      <EditChatTitleModal
        isOpen={!!selectedChat}
        currentTitle={selectedChat?.title ?? ""}
        onCancel={() => setSelectedChat(null)}
        onSave={handleEdit}
      />
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onDelete={() => chatToDelete && handleDeleteChat(chatToDelete.id)}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
      <div className="flex-grow overflow-auto scrollbar scrollbar-track-gray-100 scrollbar-thumb-gray-500">
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            onEdit={() => setSelectedChat(chat)}
            onDelete={() => promptDeleteChat(chat)}
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
