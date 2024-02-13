import type { Message } from "@prisma/client";
import { useRef, useState, useLayoutEffect } from "react";

import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";

interface Props {
  conversationId: string;
  messages: Message[];
}

export default function Conversation({
  conversationId,
  messages: initialMessages,
}: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const scrollableDiv = messagesEndRef.current;
    if (scrollableDiv) {
      scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
    }
  }, [messages]);

  function handleNewMessage(content: string) {
    // Call API Here
    const newMessage = {
      id: Math.random().toString(36).substring(7),
      content,
      isFromUser: true,
      conversationId,
      createdAt: new Date(),
    };
    const botMessage = simulateBotResponse();
    setMessages((prevMessages) => [...prevMessages, newMessage, botMessage]);
  }

  function simulateBotResponse() {
    const robotContent = [
      "beep boop",
      "I am a bot",
      "Hello, human",
      "How can I assist you?",
    ];
    const randomIndex = Math.floor(Math.random() * robotContent.length);
    const content = robotContent[randomIndex];

    const botMessage = {
      id: Math.random().toString(36).substring(7),
      content: content ?? "",
      isFromUser: false,
      conversationId,
      createdAt: new Date(),
    };

    return botMessage;
  }

  return (
    <div
      className="flex h-screen w-full flex-col overflow-y-auto"
      ref={messagesEndRef}
    >
      <header className="my-10 text-center">
        <h1 className="text-2xl font-bold">Conversation {conversationId}</h1>
      </header>
      <div className="flex-1">
        <div className="flex flex-col items-center">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </div>
      </div>
      <MessageInput onSend={handleNewMessage} />
    </div>
  );
}
