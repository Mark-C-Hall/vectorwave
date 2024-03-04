import { useRouter } from "next/router";
import Head from "next/head";

import { placeholderChats, initialMessages } from "~/data/placeholderData";
import useChats from "~/hooks/useChats";
import useAuthRedirect from "~/hooks/useAuthRedirect";
import ChatList from "~/components/ChatList";

export default function Home() {
  useAuthRedirect();
  const router = useRouter();
  const { chats, createChat, editChat, deleteChat } = useChats(
    placeholderChats,
    initialMessages,
  );

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
          onNewChat={createChat}
          onEditChat={editChat}
          onDeleteChat={deleteChat}
          onChatSelect={(chat) => router.push(`/chats/${chat.id}`)}
        />
      </main>
    </>
  );
}
