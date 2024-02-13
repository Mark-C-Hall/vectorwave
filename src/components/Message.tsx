import type { Message } from "@prisma/client";

import BotIcon from "./icons/BotIcon";
import UserIcon from "./icons/UserIcon";

interface Props {
  message: Message;
}

export default function MessageItem({ message }: Props) {
  const isFromUser = message.isFromUser;
  return (
    <div
      key={message.id}
      className="my-1 flex w-full items-center justify-center"
    >
      <div
        className={`flex w-full items-center ${
          isFromUser ? "bg-inherit" : "rounded-md bg-slate-700"
        }`}
      >
        <div
          className="flex flex-1 items-center px-6 py-5 pl-16"
          style={{ maxWidth: "none" }}
        >
          {isFromUser ? <UserIcon /> : <BotIcon />}
          <p className={`mx-auto max-w-[650px] flex-1 `}>{message.content}</p>
        </div>
      </div>
    </div>
  );
}
