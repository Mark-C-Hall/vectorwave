// Example placeholder chats
import type { Conversation, Message } from "@prisma/client";

export const placeholderChats: Conversation[] = [
  { id: "w1uf3", userId: "user1", title: "Chat 1" },
  { id: "bfgrwf", userId: "user1", title: "Chat 2" },
  { id: "eans08", userId: "user1", title: "Chat 3" },
  { id: "6qenno", userId: "user1", title: "Chat 4" },
];

export const initialMessages: Record<string, Message[]> = {
  w1uf3: [
    {
      id: "1",
      content: "I have a question",
      isFromUser: true,
      conversationId: "w1uf3",
      createdAt: new Date(),
    },
    {
      id: "2",
      content: "How can I help you?",
      isFromUser: false,
      conversationId: "w1uf3",
      createdAt: new Date(),
    },
  ],
  bfgrwf: [
    {
      id: "3",
      content: "Hello, Bot!",
      isFromUser: true,
      conversationId: "bfgrwf",
      createdAt: new Date(),
    },
    {
      id: "4",
      content: "Hi, there!",
      isFromUser: false,
      conversationId: "bfgrwf",
      createdAt: new Date(),
    },
  ],
};
