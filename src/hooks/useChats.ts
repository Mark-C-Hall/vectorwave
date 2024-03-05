import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

import { initialMessages } from "~/data/placeholderData";
import { api } from "~/utils/api";

import type { Message, Conversation } from "@prisma/client";

export default function useChats() {
  const { user } = useUser();
  const router = useRouter();
  const [chats, setChats] = useState<Conversation[]>([]);
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(initialMessages);

  const {
    data: conversations,
    isLoading,
    error,
  } = api.conversation.getConversationsByUser.useQuery(
    {
      userId: user?.id ?? "",
    },
    {
      enabled: !!user?.id,
    },
  );

  useEffect(() => {
    if (conversations) {
      setChats(conversations);
    }
  }, [conversations]);

  // Creates a new chat and navigates to its conversation page
  const createChat = (title: string) => {
    const newChatId = Math.random().toString(36).substring(7);
    const newChat = {
      id: newChatId,
      userId: user?.id ?? "",
      title,
    };

    setChats((prevChats) => [...prevChats, newChat]);
    setMessages((prevMessages) => ({
      ...prevMessages,
      [newChatId]: [],
    }));

    router
      .push(`/chats/${newChatId}`)
      .catch((err) => console.error("Navigation error:", err));
  };

  // Updates the title of an existing chat
  const editChat = (id: string, newTitle: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === id ? { ...chat, title: newTitle } : chat,
      ),
    );
  };

  // Deletes a chat
  const deleteChat = (
    id: string,
    postDeleteCallback?: (deletedChatId: string) => void,
  ) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));
    setMessages((prevMessages) => {
      const newMessages = { ...prevMessages };
      delete newMessages[id];
      return newMessages;
    });
    if (postDeleteCallback) {
      postDeleteCallback(id);
    }
  };

  return {
    chats,
    messages,
    isLoading,
    error,
    createChat,
    editChat,
    deleteChat,
  };
}
