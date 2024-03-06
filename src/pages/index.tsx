import { useRouter } from "next/router";

import useChats from "~/hooks/useChats";
import useAuthRedirect from "~/hooks/useAuthRedirect";
import LoadingPage from "~/components/LoadingPage";
import ErrorPage from "~/components/ErrorPage";
import Header from "~/components/Header";
import ChatList from "~/components/ChatList";

export default function Home() {
  console.log("Here");
  useAuthRedirect();
  const router = useRouter();
  const { chats, isLoading, error, createChat, editChat, deleteChat } =
    useChats();

  if (isLoading) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return (
    <>
      <Header
        title="Vectorwave"
        content="Harness the power of AI customer support with Vectorwave"
      />
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
