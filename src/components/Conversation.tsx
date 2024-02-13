import type { Message } from "@prisma/client";

import MessageItem from "./Message";

interface Props {
  conversationId: string;
  messages: Message[];
}

export default function Conversation({ conversationId, messages }: Props) {
  return (
    <div className="h-screen flex-1 overflow-y-auto">
      <h1 className="my-10 text-center text-2xl font-bold">
        Conversation {conversationId}
      </h1>
      <div className="flex flex-col items-center">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
