import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { api } from "~/utils/api";

import type { Message } from "@prisma/client";

/**
 * Hook to manage messages within a conversation.
 *
 * @param conversationId The ID of the conversation to manage messages for.
 * @returns Object containing messages, a loading state, an error state, and a function to handle new messages.
 */
export default function useMessage(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessageId, setLoadingMessageId] = useState<string>("");

  // Use an API query to fetch messages for a given conversation ID.
  const {
    data: fetchedMessages,
    isLoading: isMessagesLoading,
    error,
  } = api.message.getMessagesByConversationId.useQuery({ conversationId });

  // Define mutations for creating and updating messages.
  const { mutateAsync: newMessageMutate } =
    api.message.createMessage.useMutation({
      onError: (error) => toast.error(error.message),
    });

  const { mutateAsync: updateMessage } =
    api.message.updateMessage.useMutation();
  const { mutateAsync: getLLMResponse } =
    api.openai.generateLLMResponse.useMutation();

  // Create a new message in the conversation.
  const createMessage = async (
    content: string,
    isFromUser: boolean,
    conversationId: string,
  ) => {
    try {
      const newMessage = await newMessageMutate({
        content,
        isFromUser,
        conversationId,
      });
      setMessages((prev) => [...prev, newMessage]);
      return newMessage;
    } catch (error) {
      console.error("Error creating message:", error);
    }
  };

  // Handle submission of a new message and the LLM's response.
  const handleNewMessage = async (content: string, conversationId: string) => {
    const userMessage = await createMessage(content, true, conversationId);

    // If user message was successfully created, proceed to get LLM response.
    if (userMessage) {
      const tempBotMessage = await createMessage(
        "Loading...",
        false,
        conversationId,
      );
      setLoadingMessageId(tempBotMessage?.id ?? "");

      const llmResponse = await getLLMResponse({ conversationId });
      if (llmResponse.response && tempBotMessage) {
        // Update messages state optimistically with the LLM response.
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempBotMessage.id
              ? { ...msg, content: llmResponse.response }
              : msg,
          ),
        );

        // Update the temporary message with the actual response.
        await updateMessage({
          messageId: tempBotMessage.id,
          newContent: llmResponse.response,
        });

        setLoadingMessageId(""); // Clear the loading message ID.
      } else {
        setLoadingMessageId(""); // Clear the loading message ID if no response received.
      }
    }
  };

  // When messages are fetched, update the state.
  useEffect(() => {
    if (fetchedMessages) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages]);

  // Expose the state and handlers for use by consuming components.
  return {
    messages,
    isLoading: isMessagesLoading,
    loadingMessageId,
    error,
    handleNewMessage,
  };
}
