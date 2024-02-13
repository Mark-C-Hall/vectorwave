import type { Conversation } from "@prisma/client";

import EditIcon from "./icons/EditIcon";
import DeleteIcon from "./icons/DeleteIcon";

interface Props {
  chat: Conversation;
  onEdit: (chatId: string) => void;
  onDelete: (chatId: string) => void;
}

export default function ChatItem({ chat, onEdit, onDelete }: Props) {
  const handleChatItemClick = () => {
    console.log("Clicked on conversation: ", chat.id);
  };

  const handleEdit = () => onEdit(chat.id);
  const handleDelete = () => onDelete(chat.id);

  return (
    <div className="group m-auto flex h-8 w-60 cursor-pointer items-center justify-between rounded-lg px-1 py-1 hover:bg-gray-700">
      <div className="flex-grow truncate" onClick={handleChatItemClick}>
        <h3 className="truncate font-medium text-white">{chat.title}</h3>
      </div>
      <div className="hidden flex-shrink-0 group-hover:block">
        <button
          onClick={handleEdit}
          className="text-gray-300 hover:text-white"
          aria-label="Edit chat title"
        >
          <EditIcon />
        </button>
        <button
          onClick={handleDelete}
          className="text-gray-300 hover:text-white"
          aria-label="Delete conversation"
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
}
