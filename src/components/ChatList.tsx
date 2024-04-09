import { UserButton, useUser } from "@clerk/nextjs";
import { useState } from "react";

import ChatItem from "./ChatItem";
import NewChatModal from "./NewChatModal";
import EditChatModal from "./EditChatModal";
import DeleteConfirmation from "./DeleteChatModal";
import PlusIcon from "./icons/PlusIcon";
import GearIcon from "./icons/GearIcon";

import type { Conversation } from "@prisma/client";

interface Props {
  chats: Conversation[];
  isNewChat: boolean;
  onNewChat: (title: string) => void;
  onEditChat: (id: string, newTitle: string) => void;
  onDeleteChat: (id: string) => void;
  onChatSelect: (chat: Conversation) => void;
  selectedChatId?: string;
}

export default function ChatList({
  chats,
  isNewChat,
  onNewChat,
  onEditChat,
  onDeleteChat,
  onChatSelect,
  selectedChatId,
}: Props) {
  const { user } = useUser();
  const [isNewChatModalOpen, setNewChatModalOpen] = useState(isNewChat);
  const [isEditChatModalOpen, setEditChatModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);

  // Modal Functions
  const openNewChatModal = () => setNewChatModalOpen(true);

  const closeNewChatModal = () => setNewChatModalOpen(false);

  const closeEditChatModal = () => {
    setSelectedChat(null);
    setEditChatModalOpen(false);
  };

  const closeDeleteConfirmationModal = () => {
    setSelectedChat(null);
    setDeleteModalOpen(false);
  };

  // Parent Functions
  function handleCreateChat(title: string) {
    onNewChat(title);
    setNewChatModalOpen(false);
  }

  function handleEditChat(newTitle: string) {
    if (selectedChat) {
      onEditChat(selectedChat.id, newTitle);
      setEditChatModalOpen(false);
    }
  }

  function handleDeleteChat() {
    if (selectedChat) {
      onDeleteChat(selectedChat.id);
      setDeleteModalOpen(false);
    }
  }

  return (
    <aside className="flex h-screen w-[260px] flex-col items-center bg-black p-4">
      <button
        onClick={openNewChatModal}
        className="mb-14 mt-5 flex items-center justify-center rounded border border-white bg-black px-4 py-2 text-base text-white hover:bg-gray-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <PlusIcon />
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
        onEdit={handleEditChat}
        onCancel={closeEditChatModal}
      />
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onDelete={() => {
          handleDeleteChat();
        }}
        onCancel={closeDeleteConfirmationModal}
      />
      <div className="flex-grow overflow-auto scrollbar scrollbar-track-gray-100 scrollbar-thumb-gray-500">
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isSelected={chat.id === selectedChatId}
            onClick={() => onChatSelect(chat)}
            onEdit={() => {
              setSelectedChat(chat);
              setEditChatModalOpen(true);
            }}
            onDelete={() => {
              setSelectedChat(chat);
              setDeleteModalOpen(true);
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <UserButton afterSignOutUrl="/auth/login" />
        <p className="p-4">{user?.fullName}</p>
        <GearIcon />
      </div>
    </aside>
  );
}
