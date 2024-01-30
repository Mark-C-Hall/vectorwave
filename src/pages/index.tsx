import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";
import ChatList from "~/components/ChatList";

export default function Home() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    // If the user is not signed in, redirect to the login page
    if (!isSignedIn && isLoaded) {
      router.replace("/auth/login").catch((err) => {
        console.error("Failed to redirect:", err);
      });
    }
  }, [isSignedIn, isLoaded, router]);

  // If not signed in, return null to prevent a flash of unauthorized content
  if (!isSignedIn) return null;

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
          chats={[
            { id: "1", userId: "user1", title: "Chat 1" },
            { id: "2", userId: "user1", title: "Chat 2" },
            { id: "3", userId: "user1", title: "Chat 3" },
          ]}
          onEdit={(id: string) => console.log("Edit", id)}
          onDelete={(id: string) => console.log("Delete", id)}
        />
        <div className="flex-1 p-4">
          <UserButton afterSignOutUrl="/auth/login" />
          <h1 className="mb-4 text-2xl font-bold">Main Content</h1>
        </div>
      </main>
    </>
  );
}
