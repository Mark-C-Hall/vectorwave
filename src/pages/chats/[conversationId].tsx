import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";

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
  const { user } = useUser();
  const { conversationId } = router.query;
  const {
    chats,
    conversation,
    isLoading,
    error,
    createChat,
    editChat,
    deleteChat,
  } = useChats(conversationId as string);

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
  if (user?.id !== conversation?.userId) return <Page404 />;

  return (
    <>
      <Header
        title={currentChat?.title ?? "Loading..."}
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
        ) : null}
      </main>
    </>
  );
}
