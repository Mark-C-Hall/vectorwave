import { useState } from "react";

import { initialMessages } from "~/data/placeholderData";

import type { Message } from "@prisma/client";

export default function useMessage() {
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(initialMessages);

  // Function to add a new message to a conversation
  const handleNewMessage = (conversationId: string, newMessage: Message) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [conversationId]: [...(prevMessages[conversationId] ?? []), newMessage],
    }));
  };

  return {
    messages,
    handleNewMessage,
  };
}
