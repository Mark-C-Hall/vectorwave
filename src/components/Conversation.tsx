import type { Conversation, Message } from "@prisma/client";
import { useRef, useState, useLayoutEffect, useEffect } from "react";
import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";

interface Props {
  conversation: Conversation;
  messages: Message[];
  onNewMessage: (newMessage: Message) => void;
}

export default function ConversationComponent({
  conversation,
  messages: initialMessages,
  onNewMessage,
}: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const scrollableDiv = messagesEndRef.current;
    if (scrollableDiv) {
      scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const createMessage = (content: string, isFromUser: boolean) => ({
    id: Math.random().toString(36).substring(7),
    content,
    isFromUser,
    conversationId: conversation.id,
    createdAt: new Date(),
  });

  function handleNewMessage(content: string) {
    onNewMessage(createMessage(content, true));
    onNewMessage(createMessage("Your automated response here.", false));
  }

  return (
    <div
      className="flex h-screen w-full flex-col overflow-y-auto"
      ref={messagesEndRef}
    >
      <header className="my-10 text-center">
        <h1 className="text-2xl font-bold">{conversation.title}</h1>
      </header>
      <div className="flex-1">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>
      <MessageInput onSend={handleNewMessage} />
    </div>
  );
}
