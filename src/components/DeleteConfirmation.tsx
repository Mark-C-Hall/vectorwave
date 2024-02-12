import React, { useEffect, useRef } from "react";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onDelete: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmation({
  isOpen,
  onDelete,
  onCancel,
}: DeleteConfirmationProps) {
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      firstButtonRef.current?.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      onCancel();
    }
  };

  return isOpen ? (
    <div
      className="fixed inset-0 z-10 overflow-y-auto"
      onKeyDown={handleKeyDown}
    >
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-96 rounded-lg bg-gray-400 p-8">
          <h2 className="text-center text-2xl font-medium text-gray-900">
            Confirm Deletion
          </h2>
          <p className="mt-4">
            Are you sure you want to delete this conversation?
          </p>
          <div className="mt-5 flex justify-end">
            <button
              ref={firstButtonRef}
              onClick={onDelete}
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Delete
            </button>
            <button
              onClick={onCancel}
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
