import type { Conversation } from "@prisma/client";
import { UserButton, useUser } from "@clerk/nextjs";
import { useState } from "react";

import ChatItem from "./ChatItem";
import NewChatModal from "./NewChatModal";
import EditChatModal from "./EditChatModal";
import DeleteConfirmation from "./DeleteChatModal";

interface Props {
  chats: Conversation[];
}

export default function ChatList({ chats: initialChats }: Props) {
  const { user } = useUser();
  const [isNewChatModalOpen, setNewChatModalOpen] = useState(false);
  const [isEditChatModalOpen, setEditChatModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [chats, setChats] = useState(initialChats);

  // New Chat Modal
  const openNewChatModal = () => setNewChatModalOpen(true);
  const closeNewChatModal = () => setNewChatModalOpen(false);

  // Edit Chat Modal
  const openEditChatModal = (chat: Conversation) => {
    setSelectedChat(chat);
    setEditChatModalOpen(true);
  };
  const closeEditChatModal = () => {
    setSelectedChat(null);
    setEditChatModalOpen(false);
  };

  // Delete Confirmation Modal
  const openDeleteConfirmationModal = (chat: Conversation) => {
    setSelectedChat(chat);
    setDeleteModalOpen(true);
  };
  const closeDeleteConfirmationModal = () => {
    setSelectedChat(null);
    setDeleteModalOpen(false);
  };

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
    setNewChatModalOpen(false);
  }

  function handleEdit(newTitle: string) {
    console.log(`Editing chat title to: ${newTitle}`);
    // Here you can call your API to update the chat title
    const updatedChats = chats.map((chat) =>
      chat.id === selectedChat!.id ? { ...chat, title: newTitle } : chat,
    );
    setChats(updatedChats);
    setSelectedChat(null);
    setEditChatModalOpen(false);
  }

  function handleDeleteChat(id: string) {
    console.log(`Deleting chat with id: ${id}`);
    // Here you can call your API to delete the chat
    const updatedChats = chats.filter((chat) => chat.id !== id);
    setChats(updatedChats);
    setDeleteModalOpen(false);
  }

  return (
    <aside className="flex h-screen w-[260px] flex-col items-center bg-black p-4">
      <button
        onClick={openNewChatModal}
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
        isOpen={isNewChatModalOpen}
        onCreate={handleCreateChat}
        onCancel={closeNewChatModal}
      />
      <EditChatModal
        isOpen={isEditChatModalOpen}
        currentTitle={selectedChat?.title ?? ""}
        onEdit={handleEdit}
        onCancel={closeEditChatModal}
      />
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onDelete={() => selectedChat && handleDeleteChat(selectedChat.id)}
        onCancel={closeDeleteConfirmationModal}
      />
      <div className="flex-grow overflow-auto scrollbar scrollbar-track-gray-100 scrollbar-thumb-gray-500">
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            onEdit={() => openEditChatModal(chat)}
            onDelete={() => openDeleteConfirmationModal(chat)}
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
