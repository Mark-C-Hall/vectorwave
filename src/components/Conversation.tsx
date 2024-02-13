import type { Message } from "@prisma/client";
import { useEffect, useRef } from "react";

import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";

interface Props {
  conversationId: string;
  messages: Message[];
}

export default function Conversation({ conversationId, messages }: Props) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      const scrollableDiv = messagesEndRef.current;
      scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
    }
  }, []);

  return (
    <div
      className="flex h-screen w-full flex-col overflow-y-auto"
      ref={messagesEndRef}
    >
      <h1 className="my-10 text-center text-2xl font-bold">
        Conversation {conversationId}
      </h1>
      <div className="flex-1 ">
        <div className="flex flex-col items-center">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </div>
      </div>
      <MessageInput />
    </div>
  );
}
