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
    error: fetchMessagesError,
  } = api.message.getMessagesByConversationId.useQuery({ conversationId });

  // Define mutations for creating and updating messages.
  const {
    mutateAsync: newMessageMutate,
    isLoading: isMessageCreating,
    error: createMessageError,
  } = api.message.createMessage.useMutation({
    onError: (error) => toast.error(error.message),
  });

  const {
    mutateAsync: updateMessage,
    isLoading: isMessageUpdating,
    error: updateMessageError,
  } = api.message.updateMessage.useMutation({
    onError: (error) => toast.error(error.message),
  });

  // Define a mutation to generate a response from the LLM.
  const {
    mutateAsync: getLLMResponse,
    isLoading: isLLMResponseLoading,
    error: LLMResponseError,
  } = api.openai.generateLLMResponse.useMutation({
    onError: (error) => toast.error(error.message),
  });

  // Create a new message in the conversation.
  const createMessage = async (
    content: string,
    isFromUser: boolean,
    isFile: boolean,
    conversationId: string,
  ) => {
    try {
      const newMessage = await newMessageMutate({
        content,
        isFromUser,
        isFile,
        conversationId,
      });
      setMessages((prev) => [...prev, newMessage]);
      return newMessage;
    } catch (error) {
      console.error("Error creating message:", error);
    }
  };

  // Handle submission of a new message and the LLM's response.
  const handleNewMessage = async (
    content: string,
    fileContent: string,
    fileName: string,
  ) => {
    // First check if file is included. If so, create a new message.
    if (fileContent) {
      await createMessage(
        "Attached file: " + fileName + "\n" + fileContent,
        true,
        true,
        conversationId,
      );
    }

    // Create User's Message
    await createMessage(content, true, false, conversationId);

    // If user message was successfully created, proceed to get LLM response.
    if (!isMessageCreating) {
      const tempBotMessage = await createMessage(
        "Loading...",
        false,
        false,
        conversationId,
      );
      setLoadingMessageId(tempBotMessage?.id ?? "");

      const llmResponse = await getLLMResponse({ conversationId });

      if (llmResponse.response && tempBotMessage) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempBotMessage.id
              ? { ...msg, content: llmResponse.response }
              : msg,
          ),
        );
        await updateMessage({
          messageId: tempBotMessage.id,
          newContent: llmResponse.response,
        });
        setLoadingMessageId("");
      } else {
        setLoadingMessageId("");
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
    error:
      fetchMessagesError ??
      createMessageError ??
      updateMessageError ??
      LLMResponseError,
    isUploading: isMessageCreating || isMessageUpdating || isLLMResponseLoading,
    handleNewMessage,
  };
}
