import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

import type { Message, Conversation } from "@prisma/client";

export default function useChats(
  initalChats: Conversation[],
  initalMessages: Record<string, Message[]>,
) {
  const router = useRouter();
  const { user } = useUser();
  const [chats, setChats] = useState(initalChats);
  const [messages, setMessages] = useState(initalMessages);

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
    createChat,
    editChat,
    deleteChat,
  };
}
