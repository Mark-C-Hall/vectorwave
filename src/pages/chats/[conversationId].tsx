import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";

import ChatList from "~/components/ChatList";
import ConversationComponent from "~/components/Conversation";

import { type Conversation } from "@prisma/client";
import { type Message } from "@prisma/client";

// Example placeholder chats
const placeholderChats: Conversation[] = [
  { id: "w1uf3", userId: "user1", title: "Chat 1" },
  { id: "bfgrwf", userId: "user1", title: "Chat 2" },
  { id: "eans08", userId: "user1", title: "Chat 3" },
  { id: "6qenno", userId: "user1", title: "Chat 4" },
];

// Adjusted placeholderMessages to be indexed by conversationId
const initialMessages: Record<string, Message[]> = {
  w1uf3: [
    {
      id: "1",
      content: "I have a question",
      isFromUser: true,
      conversationId: "w1uf3",
      createdAt: new Date(),
    },
    {
      id: "2",
      content: "How can I help you?",
      isFromUser: false,
      conversationId: "w1uf3",
      createdAt: new Date(),
    },
  ],
  bfgrwf: [
    {
      id: "3",
      content: "Hello, Bot!",
      isFromUser: true,
      conversationId: "bfgrwf",
      createdAt: new Date(),
    },
    {
      id: "4",
      content: "Hi, there!",
      isFromUser: false,
      conversationId: "bfgrwf",
      createdAt: new Date(),
    },
  ],
};

export default function ChatPage() {
  const router = useRouter();
  const { conversationId } = router.query;
  const { isSignedIn, isLoaded, user } = useUser();
  const [chats, setChats] = useState(placeholderChats);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState(initialMessages);

  const handleCreateChat = (title: string) => {
    const newChatId = Math.random().toString(36).substring(7);
    const newChat = {
      id: newChatId,
      userId: user?.id ?? "",
      title,
    };

    setChats((prevChats) => [...prevChats, newChat]);
    setMessages((prevMessages) => ({
      ...prevMessages,
      [newChatId]: [],
    }));

    router.push(`/chats/${newChatId}`).catch((err) => {
      console.error("Failed to navigate to the new chat:", err);
    });
  };

  const handleEditChat = (id: string, newTitle: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === id ? { ...chat, title: newTitle } : chat,
      ),
    );
  };

  const handleDeleteChat = (id: string) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));
    // If the deleted chat is the currently selected one, navigate to root
    if (selectedChat?.id === id) {
      router.push("/").catch((err) => {
        console.error("Failed to navigate to the root page:", err);
      });
    }
  };

  // Function to add a new message to the current conversation
  const handleNewMessage = (conversationId: string, newMessage: Message) => {
    // Append newMessage to the current conversation's messages
    setMessages((prevMessages) => ({
      ...prevMessages,
      [conversationId]: [...(prevMessages[conversationId] ?? []), newMessage],
    }));
  };

  // Extract messages for the selected conversation
  const selectedChatMessages = messages[conversationId as string] ?? [];

  useEffect(() => {
    // If the user is not signed in, redirect to the login page
    if (!isSignedIn && isLoaded) {
      router.replace("/auth/login").catch((err) => {
        console.error("Failed to redirect:", err);
      });
    }
  }, [isSignedIn, isLoaded, router]);

  useEffect(() => {
    // Simulate fetching conversation based on conversationId
    if (typeof conversationId === "string") {
      const chat = chats.find((chat) => chat.id === conversationId);
      setSelectedChat(chat ?? null);
    }
  }, [chats, conversationId]);

  // If not signed in, return null to prevent a flash of unauthorized content
  if (!isSignedIn) return null;

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
          onNewChat={handleCreateChat}
          onEditChat={handleEditChat}
          onDeleteChat={handleDeleteChat}
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
