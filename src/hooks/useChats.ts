import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { initialMessages } from "~/data/placeholderData";
import { api } from "~/utils/api";

import type { Message, Conversation } from "@prisma/client";

/**
 * Custom hook for managing chats and messages.
 * Provides functions for creating, editing, and deleting chats,
 * as well as access to the list of chats and messages.
 *
 * @returns An object containing the chats, messages, loading state, error, and functions for creating, editing, and deleting chats.
 */
export default function useChats() {
  const router = useRouter();
  const [chats, setChats] = useState<Conversation[]>([]);
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(initialMessages);

  // Fetch conversations from the API
  const {
    data: conversations,
    isLoading: isConversationsLoading,
    error,
  } = api.conversation.getConversationsByUser.useQuery();

  // Create a new conversation
  const { mutateAsync, isLoading: isCreatingConversation } =
    api.conversation.createConversation.useMutation();

  useEffect(() => {
    // Update the chats state when conversations data changes
    if (conversations) {
      setChats(conversations);
    }
  }, [conversations]);

  /**
   * Creates a new chat with the given title.
   * Navigates to the chat page after successful creation.
   *
   * @param title - The title of the new chat.
   */
  const createChat = async (title: string) => {
    if (isCreatingConversation) {
      console.error("Mutation is already in progress");
      return;
    }

    try {
      const newChat = await mutateAsync({
        title,
      });

      // Update the chats and messages state with the new chat
      setChats((prevChats) => [...prevChats, newChat]);
      setMessages((prevMessages) => ({
        ...prevMessages,
        [newChat.id]: [],
      }));

      // Navigate to the chat page
      router
        .push(`/chats/${newChat.id}`)
        .catch((err) => console.error("Navigation error:", err));
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  /**
   * Updates the title of an existing chat.
   *
   * @param id - The ID of the chat to edit.
   * @param newTitle - The new title for the chat.
   */
  const editChat = (id: string, newTitle: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === id ? { ...chat, title: newTitle } : chat,
      ),
    );
  };

  /**
   * Deletes a chat.
   *
   * @param id - The ID of the chat to delete.
   * @param postDeleteCallback - Optional callback function to be called after the chat is deleted.
   */
  const deleteChat = (
    id: string,
    postDeleteCallback?: (deletedChatId: string) => void,
  ) => {
    // Remove the chat from the chats state
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));

    // Remove the chat's messages from the messages state
    setMessages((prevMessages) => {
      const newMessages = { ...prevMessages };
      delete newMessages[id];
      return newMessages;
    });

    // Call the postDeleteCallback if provided
    if (postDeleteCallback) {
      postDeleteCallback(id);
    }
  };

  return {
    chats,
    messages,
    isLoading: isConversationsLoading,
    error,
    createChat,
    editChat,
    deleteChat,
  };
}
