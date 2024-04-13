import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { api } from "~/utils/api";

import type { Message } from "@prisma/client";

/**
 * Hook to manage messages within a conversation.
 * @param conversationId The ID of the conversation.
 * @returns Object containing messages, loading state, error state, and a function to handle new messages.
 */
export default function useMessage(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessageId, setLoadingMessageId] = useState<string>("");

  // API query to fetch messages for the conversation
  const {
    data: fetchedMessages,
    isLoading: isMessagesLoading,
    error: fetchMessagesError,
  } = api.message.getMessagesByConversationId.useQuery({ conversationId });

  // Mutation for creating messages
  const {
    mutateAsync: newMessageMutate,
    isLoading: isMessageCreating,
    error: createMessageError,
  } = api.message.createMessage.useMutation({
    onError: (error) => toast.error(error.message),
  });

  // Mutation to update a message
  const {
    mutateAsync: updateMessage,
    isLoading: isMessageUpdating,
    error: updateMessageError,
  } = api.message.updateMessage.useMutation({
    onError: (error) => toast.error(error.message),
  });

  // Mutation to generate a response from the LLM
  const {
    mutateAsync: getLLMResponse,
    isLoading: isLLMResponseLoading,
    error: LLMResponseError,
  } = api.openai.generateLLMResponse.useMutation({
    onError: (error) => toast.error(error.message),
  });

  // Mutation to get embeddings for a query
  const {
    mutateAsync: getEmbedding,
    isLoading: isEmbeddingLoading,
    error: embeddingError,
  } = api.openai.embedQuery.useMutation({
    onError: (error) => toast.error(error.message),
  });

  // Mutation to get top results from the embeddings index
  const {
    mutateAsync: getTopResults,
    isLoading: isTopResultsLoading,
    error: topResultsError,
  } = api.openai.getTopResults.useMutation({
    onError: (error) => toast.error(error.message),
  });

  // Create a new message in the conversation
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

  // Handle submission of a new message and the LLM's response
  const handleNewMessage = async (
    content: string,
    fileContent: string,
    fileName: string,
    isVectorMode: boolean,
  ) => {
    // Create a message for the attached file, if provided
    if (fileContent) {
      await createMessage(
        "Attached file: " + fileName + "\n" + fileContent,
        true,
        true,
        conversationId,
      );
    }

    // If vector mode is enabled, include top 3 results as attachment
    if (isVectorMode) {
      const embeddedQuery = await getEmbedding({ content });
      const topResults = await getTopResults({
        vector: embeddedQuery,
        topK: 3,
      });
      await createMessage(
        "Vector Results:\n" + topResults.join("\n"),
        true,
        true,
        conversationId,
      );
    }

    // Create user's message
    await createMessage(content, true, false, conversationId);

    // Get LLM response if user message was successfully created
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

  // Update messages state when fetched messages change
  useEffect(() => {
    if (fetchedMessages) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages]);

  return {
    messages,
    isLoading: isMessagesLoading,
    loadingMessageId,
    error:
      fetchMessagesError ??
      createMessageError ??
      updateMessageError ??
      LLMResponseError ??
      embeddingError ??
      topResultsError,
    isUploading:
      isMessageCreating ||
      isMessageUpdating ||
      isLLMResponseLoading ||
      isEmbeddingLoading ||
      isTopResultsLoading,
    handleNewMessage,
  };
}
