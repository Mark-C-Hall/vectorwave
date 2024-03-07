import { useState, useEffect } from "react";

import { api } from "~/utils/api";

import type { Message } from "@prisma/client";

export default function useMessage(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  // Fetch messages from the API
  const {
    data: fetchedMessages,
    isLoading,
    error,
  } = api.message.getMessagesByConversationId.useQuery({ conversationId });

  // Function to create a new message
  const createMessage = (
    content: string,
    isFromUser: boolean,
    conversationId: string,
  ): Message => ({
    id: Math.random().toString(36).substring(7), // This is a placeholder. In a real app, IDs should be generated server-side.
    content,
    isFromUser,
    conversationId,
    createdAt: new Date(),
  });

  // Function to add a new message to the conversation
  const handleNewMessage = (content: string, conversationId: string) => {
    const userMessage = createMessage(content, true, conversationId);
    setMessages((prev) => [...prev, userMessage]);

    // Example automated response
    const automatedResponse = createMessage(
      "Your automated response here.",
      false,
      conversationId,
    );
    setMessages((prev) => [...prev, automatedResponse]);
  };

  useEffect(() => {
    // Update the chats state when conversations data changes
    if (fetchedMessages) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages]);

  return {
    messages,
    isLoading,
    error,
    handleNewMessage,
  };
}
