import { useState, useRef, type KeyboardEvent } from "react";

import SendIcon from "./icons/SendIcon";
import PaperClipIcon from "./icons/PaperClipIcon";

interface Props {
  onSend: (message: string) => void;
}

export default function MessageInput({ onSend }: Props) {
  const [messageText, setMessageText] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage();
  };

  const sendMessage = () => {
    const combinedMessage = messageText + fileContent;
    if (!combinedMessage.trim()) return;
    onSend(combinedMessage);
    setMessageText("");
    setFileContent("");
    setFileName("");
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/plain") {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === "string") {
          setFileContent(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {fileName && (
        <div className="mx-auto my-4 max-w-[650px] bg-slate-800 p-2 text-white">
          Attached file: {fileName}
        </div>
      )}
      <form
        className="mx-auto my-4 flex w-full max-w-[650px] items-stretch rounded-lg border-2 border-white bg-slate-800"
        onSubmit={handleSubmit}
      >
        <button
          type="button"
          className="flex w-12 items-center justify-center bg-white"
          onClick={triggerFileUpload}
          aria-label="Attach file"
        >
          <PaperClipIcon />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept=".txt"
        />
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
    </>
  );
}
