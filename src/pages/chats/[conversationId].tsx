import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import useAuthRedirect from "~/hooks/useAuthRedirect";
import useChats from "~/hooks/useChats";
import useMessage from "~/hooks/useMessages";
import LoadingPage from "~/components/LoadingPage";
import ErrorPage from "~/components/ErrorPage";
import Header from "~/components/Header";
import ChatList from "~/components/ChatList";
import ConversationComponent from "~/components/Conversation";

import type { Conversation } from "@prisma/client";

export default function ChatPage() {
  useAuthRedirect();
  const router = useRouter();
  const { conversationId } = router.query;
  const { chats, isLoading, error, createChat, editChat, deleteChat } =
    useChats();
  const { messages, handleNewMessage } = useMessage();
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);

  // Function to delete a chat and navigate to the root page
  const deleteChatAndNavigate = async (id: string) => {
    await deleteChat(id, (deletedChatId) => {
      if (selectedChat?.id === deletedChatId) {
        router
          .push("/")
          .catch((err) =>
            console.error("Failed to navigate to the root page:", err),
          );
      }
    });
  };

  // Extract messages for the selected conversation
  const selectedChatMessages = messages[conversationId as string] ?? [];

  // Fetch the selected chat based on the conversationId
  useEffect(() => {
    if (typeof conversationId === "string") {
      const chat = chats.find((chat) => chat.id === conversationId);
      setSelectedChat(chat ?? null);
    }
  }, [chats, conversationId]);

  if (isLoading) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return (
    <>
      <Header
        title={selectedChat?.title ?? "Loading..."}
        content="Chat Conversation Page"
      />
      <main className="flex">
        <ChatList
          chats={chats}
          isNewChat={false}
          onNewChat={createChat}
          onEditChat={editChat}
          onDeleteChat={deleteChatAndNavigate}
          onChatSelect={(chat) => router.push(`/chats/${chat.id}`)}
          selectedChatId={
            typeof conversationId === "string" ? conversationId : undefined
          }
        />

        {selectedChat ? (
          <ConversationComponent
            conversation={selectedChat}
            messages={selectedChatMessages}
            onNewMessage={(newMessage) =>
              handleNewMessage(selectedChat.id, newMessage)
            }
          />
        ) : null}
      </main>
    </>
  );
}
