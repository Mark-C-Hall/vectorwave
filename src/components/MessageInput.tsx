import { useState } from "react";

import SendIcon from "./icons/SendIcon";

export default function MessageInput() {
  const [messageText, setMessageText] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Add your submit logic here
    console.log(messageText);
    // Clear the message text
    setMessageText("");
  };

  return (
    <form
      className="mx-auto mb-4 flex w-full max-w-[650px] items-stretch  rounded-lg border-2 border-white bg-slate-800"
      onSubmit={handleSubmit}
    >
      <textarea
        className="flex-1 resize-none bg-inherit p-2 text-lg text-white placeholder-gray-300"
        placeholder="Type your message here..."
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        rows={3}
      ></textarea>
      <button
        type="submit"
        className="flex w-12 items-center justify-center bg-white"
      >
        <SendIcon />
      </button>
    </form>
  );
}
