import { useRouter } from "next/router";

import useAuthRedirect from "~/hooks/useAuthRedirect";
import useChats from "~/hooks/useChats";
import LoadingPage from "~/components/LoadingPage";
import ErrorPage from "~/components/ErrorPage";
import Page404 from "~/components/Page404";
import Header from "~/components/Header";
import ChatList from "~/components/ChatList";
import ConversationComponent from "~/components/Conversation";

export default function ChatPage() {
  useAuthRedirect();
  const router = useRouter();
  const { conversationId } = router.query;
  const { chats, isLoading, error, createChat, editChat, deleteChat } =
    useChats();

  const currentChat = chats.find((chat) => chat.id === conversationId);

  // Function to delete a chat and navigate to the root page
  const deleteChatAndNavigate = async (id: string) => {
    await deleteChat(id, (deletedChatId) => {
      if (currentChat?.id === deletedChatId) {
        router
          .push("/")
          .catch((err) =>
            console.error("Failed to navigate to the root page:", err),
          );
      }
    });
  };

  if (isLoading) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return (
    <>
      <Header
        title={currentChat?.title ?? "Page 404"}
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
          selectedChatId={conversationId as string}
        />

        {currentChat ? (
          <ConversationComponent conversation={currentChat} />
        ) : (
          <Page404 />
        )}
      </main>
    </>
  );
}
