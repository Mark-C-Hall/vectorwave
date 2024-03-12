import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { api } from "~/utils/api";

import type { Message } from "@prisma/client";

/**
 * Custom hook for managing messages in a conversation.
 * @param conversationId - The ID of the conversation.
 * @returns An object containing messages, loading state, error, and a function to handle new messages.
 */
export default function useMessage(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  // Fetch messages from the API
  const {
    data: fetchedMessages,
    isLoading: isMessagesLoading,
    error,
  } = api.message.getMessagesByConversationId.useQuery({ conversationId });

  // Create a new message
  const { mutateAsync: newMessageMutate, isLoading: isCreatingMessage } =
    api.message.createMessage.useMutation({
      onError: (error) => toast.error(error.message),
    });

  /**
   * Function to create a new message and add it to the state.
   * @param content - The content of the message.
   * @param isFromUser - Indicates whether the message is from the user or not.
   * @param conversationId - The ID of the conversation.
   */
  const createMessage = async (
    content: string,
    isFromUser: boolean,
    conversationId: string,
  ) => {
    if (isCreatingMessage) {
      console.error("Mutation is already in progress");
      return;
    }

    try {
      const newMessage = await newMessageMutate({
        content,
        isFromUser,
        conversationId,
      });

      // Update the messages state with the new message
      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error("Error creating message:", error);
    }
  };

  /**
   * Function to handle a new message and bot response.
   * @param content - The content of the message.
   * @param conversationId - The ID of the conversation.
   */
  const handleNewMessage = async (content: string, conversationId: string) => {
    await createMessage(content, true, conversationId);

    // Example automated response
    await createMessage("Your automated response here.", false, conversationId);
  };

  useEffect(() => {
    // Update the messages state when fetchedMessages data changes
    if (fetchedMessages) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages]);

  return {
    messages,
    isLoading: isMessagesLoading,
    error,
    handleNewMessage,
  };
}
