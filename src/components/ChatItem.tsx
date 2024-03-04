import EditIcon from "./icons/EditIcon";
import DeleteIcon from "./icons/DeleteIcon";

import type { Conversation } from "@prisma/client";

interface Props {
  chat: Conversation;
  isSelected: boolean;
  onClick: () => void;
  onEdit: (chatId: string) => void;
  onDelete: (chatId: string) => void;
}

export default function ChatItem({
  chat: { id, title },
  isSelected,
  onClick,
  onEdit,
  onDelete,
}: Props) {
  // Apply conditional styling based on selection
  const isSelectedClass = isSelected ? "bg-gray-700 text-white" : "";

  return (
    <div
      className={`group m-auto flex h-8 w-60 cursor-pointer items-center justify-between rounded-lg px-1 py-1 hover:bg-gray-700 ${isSelectedClass}`}
      onClick={onClick}
    >
      <h3 className="flex-grow truncate font-medium text-white">{title}</h3>
      <div className="hidden flex-shrink-0 group-hover:block">
        {/* Prevent event bubbling to avoid triggering onClick for the chat item */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(id);
          }}
          className="text-gray-300 hover:text-white"
          aria-label="Edit chat title"
        >
          <EditIcon />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="text-gray-300 hover:text-white"
          aria-label="Delete conversation"
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
}
