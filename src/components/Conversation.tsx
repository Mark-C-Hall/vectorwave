import { useRef, useLayoutEffect } from "react";

import MessageItem from "~/components/MessageItem";
import MessageInput from "~/components/MessageInput";
import useMessage from "~/hooks/useMessages";

import type { Conversation } from "@prisma/client";

interface Props {
  conversation: Conversation;
}

export default function ConversationComponent({ conversation }: Props) {
  const { messages, handleNewMessage } = useMessage(conversation.id);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const scrollableDiv = messagesEndRef.current;
    if (scrollableDiv) {
      scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
    }
  }, [messages]);

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
      <MessageInput
        onSend={(content) => handleNewMessage(content, conversation.id)}
      />
    </div>
  );
}
