import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { api } from "~/utils/api";

import type { Conversation } from "@prisma/client";

/**
 * Custom hook for managing chats and messages.
 * Provides functions for creating, editing, and deleting chats,
 * as well as access to the list of chats and messages.
 *
 * @returns An object containing the chats, messages, loading state, error, and functions for creating, editing, and deleting chats.
 */
export default function useChats(userId = "") {
  const router = useRouter();
  const [chats, setChats] = useState<Conversation[]>([]);

  // Fetch conversations from the API
  const {
    data: conversations,
    isLoading: isConversationsLoading,
    error,
  } = api.conversation.getConversationsByUser.useQuery();

  // Create a new conversation
  const { mutateAsync: newChatMutate, isLoading: isCreatingConversation } =
    api.conversation.createConversation.useMutation({
      onError: (error) => toast.error(error.message),
    });

  // Update a conversation
  const { mutateAsync: editChatMutate, isLoading: isEditingConversation } =
    api.conversation.editConversation.useMutation({
      onError: (error) => toast.error(error.message),
    });

  // Delete a conversation
  const { mutateAsync: deleteChatMutate } =
    api.conversation.deleteConversation.useMutation({
      onError: (error) => toast.error(error.message),
    });

  // Fetch a conversation by its ID
  const {
    data: conversation,
    isLoading: isConversationLoading,
    error: conversationError,
  } = api.conversation.getConversationById.useQuery({ id: userId });

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
      const newChat = await newChatMutate({
        title,
      });

      // Update the chats and messages state with the new chat
      setChats((prevChats) => [...prevChats, newChat]);

      // Navigate to the chat page
      router
        .push(`/chats/${newChat.id}`)
        .catch((err) => console.error("Navigation error:", err));
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  /**
   * Edits a chat with the specified ID by updating its title.
   *
   * @param id - The ID of the chat to edit.
   * @param newTitle - The new title for the chat.
   */
  const editChat = async (id: string, newTitle: string) => {
    if (isEditingConversation) {
      console.error("Mutation is already in progress");
      return;
    }

    try {
      const newChat = await editChatMutate({
        id,
        title: newTitle,
      });

      // Update the chats state with the updated chat
      setChats((prevChats) =>
        prevChats.map((chat) => (chat.id === id ? newChat : chat)),
      );
    } catch (error) {
      console.error("Error editing chat:", error);
    }
  };

  /**
   * Deletes a chat by its ID.
   *
   * @param id - The ID of the chat to delete.
   * @param postDeleteCallback - An optional callback function to be called after the chat is deleted.
   */
  const deleteChat = async (
    id: string,
    postDeleteCallback?: (deletedChatId: string) => void,
  ) => {
    try {
      await deleteChatMutate({ id });

      // Update the chats and messages state by removing the deleted chat
      setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));

      // Call the post-delete callback if provided
      if (postDeleteCallback) {
        postDeleteCallback(id);
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  return {
    chats,
    isLoading: isConversationsLoading,
    error,
    conversation,
    isConversationLoading,
    conversationError,
    createChat,
    editChat,
    deleteChat,
  };
}
