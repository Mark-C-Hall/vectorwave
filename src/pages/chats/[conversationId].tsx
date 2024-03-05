import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";

import { initialMessages } from "~/data/placeholderData";
import useChats from "~/hooks/useChats";
import useAuthRedirect from "~/hooks/useAuthRedirect";
import ChatList from "~/components/ChatList";
import ConversationComponent from "~/components/Conversation";

import type { Conversation, Message } from "@prisma/client";

export default function ChatPage() {
  useAuthRedirect();
  const router = useRouter();
  const { conversationId } = router.query;
  const { chats, createChat, editChat, deleteChat } = useChats();
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState(initialMessages);

  // Function to delete a chat and navigate to the root page
  const deleteChatAndNavigate = (id: string) => {
    deleteChat(id, (deletedChatId) => {
      if (selectedChat?.id === deletedChatId) {
        router
          .push("/")
          .catch((err) =>
            console.error("Failed to navigate to the root page:", err),
          );
      }
    });
  };

  // Function to add a new message to the current conversation
  const handleNewMessage = (conversationId: string, newMessage: Message) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [conversationId]: [...(prevMessages[conversationId] ?? []), newMessage],
    }));
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

  return (
    <>
      <Head>
        <title>{selectedChat ? selectedChat.title : "Loading..."}</title>
        <meta name="description" content="Chat conversation page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
