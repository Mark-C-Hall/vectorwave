import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";

import ChatList from "~/components/ChatList";

import { type Conversation } from "@prisma/client";

// Example placeholder chats
const placeholderChats: Conversation[] = [
  { id: "w1uf3", userId: "user1", title: "Chat 1" },
  { id: "bfgrwf", userId: "user1", title: "Chat 2" },
  { id: "eans08", userId: "user1", title: "Chat 3" },
  { id: "6qenno", userId: "user1", title: "Chat 4" },
];

export default function Home() {
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();
  const [chats, setChats] = useState(placeholderChats);

  // Creates a new chat and navigates to its conversation page
  const handleCreateChat = (title: string) => {
    const newChatId = Math.random().toString(36).substring(7);
    const newChat = { id: newChatId, userId: user?.id ?? "", title };
    setChats((prevChats) => [...prevChats, newChat]);
    router
      .push(`/chats/${newChatId}`)
      .catch((err) => console.error("Navigation error:", err));
  };

  // Updates the title of an existing chat
  const handleEditChat = (id: string, newTitle: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === id ? { ...chat, title: newTitle } : chat,
      ),
    );
  };

  // Deletes a chat
  const handleDeleteChat = (id: string) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));
  };

  // Redirects to login if not signed in
  useEffect(() => {
    if (!isSignedIn && isLoaded)
      router
        .replace("/auth/login")
        .catch((err) => console.error("Redirect error:", err));
  }, [isSignedIn, isLoaded, router]);

  if (!isSignedIn) return null; // Prevents content flash if not authorized

  return (
    <>
      <Head>
        <title>VectorWave</title>
        <meta
          name="description"
          content="Query documents with the power of AI"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex">
        <ChatList
          chats={chats}
          isNewChat={true}
          onNewChat={handleCreateChat}
          onEditChat={handleEditChat}
          onDeleteChat={handleDeleteChat}
          onChatSelect={(chat) => router.push(`/chats/${chat.id}`)}
        />
      </main>
    </>
  );
}
