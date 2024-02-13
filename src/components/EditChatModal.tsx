import { useEffect, useRef, useState } from "react";

interface Props {
  isOpen: boolean;
  currentTitle: string;
  onEdit: (newTitle: string) => void;
  onCancel: () => void;
}

export default function EditChatModal({
  isOpen,
  currentTitle,
  onEdit,
  onCancel,
}: Props) {
  const [newTitle, setNewTitle] = useState(currentTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setNewTitle(currentTitle);
  }, [currentTitle, isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      onCancel();
    }
  };

  const handleSave = () => {
    if (newTitle.trim() === "") {
      alert("Please enter a chat title.");
      return;
    }
    onEdit(newTitle);
  };

  return isOpen ? (
    <div
      className="fixed inset-0 z-10 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onKeyDown={handleKeyDown}
    >
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-96 rounded-lg bg-gray-400 p-8">
          <h2
            id="modal-title"
            className="text-center text-2xl font-medium text-gray-900"
          >
            Edit Chat Title
          </h2>
          <div className="mt-5">
            <label
              htmlFor="chat-title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <div className="mt-1">
              <input
                type="text"
                ref={inputRef}
                name="chat-title"
                id="chat-title"
                className="block w-full rounded-md border-gray-300 pl-3 text-black shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={currentTitle}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button
              onClick={() => handleSave()}
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save
            </button>
            <button
              onClick={() => {
                onCancel();
                setNewTitle(currentTitle);
              }}
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
