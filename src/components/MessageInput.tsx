import { useState, type KeyboardEvent } from "react";

import SendIcon from "./icons/SendIcon";

interface Props {
  onSend: (message: string) => void;
}

export default function MessageInput({ onSend }: Props) {
  const [messageText, setMessageText] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage();
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;
    onSend(messageText);
    setMessageText("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(event.target.value);
  };

  return (
    <form
      className="mx-auto my-4 flex w-full max-w-[650px] items-stretch rounded-lg border-2 border-white bg-slate-800"
      onSubmit={handleSubmit}
    >
      <textarea
        className="flex-1 resize-none bg-inherit p-2 text-lg text-white placeholder-gray-300"
        placeholder="Type your message here..."
        value={messageText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={3}
      ></textarea>
      <button
        type="submit"
        className="flex w-12 items-center justify-center bg-white"
        aria-label="Send message"
      >
        <SendIcon />
      </button>
    </form>
  );
}
