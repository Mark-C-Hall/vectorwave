import React from "react";

import BotIcon from "./icons/BotIcon";
import UserIcon from "./icons/UserIcon";
import LoadingIcon from "./icons/LoadingIcon";

import type { Message } from "@prisma/client";

interface Props {
  message: Message;
  isBotResponseLoading: boolean;
}

export default function MessageItem({ message, isBotResponseLoading }: Props) {
  const isFromUser = message.isFromUser;
  const isFile = message.isFile;
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
          className="flex flex-1 items-center px-20 py-5"
          style={{ maxWidth: "none" }}
        >
          {isFromUser ? <UserIcon /> : <BotIcon />}
          <div className="mx-auto max-w-[650px] flex-1">
            {isBotResponseLoading ? (
              <LoadingIcon />
            ) : isFile ? (
              <p className="my-4">{message.content.split("\n")[0]}</p>
            ) : (
              message.content.split("\n").map((line, index) => (
                <p className="my-4" key={index}>
                  {line}
                </p>
              ))
            )}
          </div>
          {/* Div is used to center above p evenly */}
          <div className="invisible">
            <UserIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
