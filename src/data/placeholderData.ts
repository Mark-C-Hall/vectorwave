// Example placeholder chats
import type { Message } from "@prisma/client";

export const initialMessages: Record<string, Message[]> = {
  cltewnh8a0000jmj69m8x0bsv: [
    {
      id: "1",
      content: "I have a question",
      isFromUser: true,
      conversationId: "cltewnh8a0000jmj69m8x0bsv",
      createdAt: new Date(),
    },
    {
      id: "2",
      content: "How can I help you?",
      isFromUser: false,
      conversationId: "cltewnh8a0000jmj69m8x0bsv",
      createdAt: new Date(),
    },
  ],
  cltewo2e00001jmj6sb7qati2: [
    {
      id: "3",
      content: "Hello, Bot!",
      isFromUser: true,
      conversationId: "cltewo2e00001jmj6sb7qati2",
      createdAt: new Date(),
    },
    {
      id: "4",
      content: "Hi, there!",
      isFromUser: false,
      conversationId: "cltewo2e00001jmj6sb7qati2",
      createdAt: new Date(),
    },
  ],
};
