import { useRouter } from "next/router";
import React from "react";

import useChats from "~/hooks/useChats";
import useAuthRedirect from "~/hooks/useAuthRedirect";
import useDocs from "~/hooks/useDocs";
import LoadingPage from "~/components/LoadingPage";
import ErrorPage from "~/components/ErrorPage";
import Header from "~/components/Header";
import ChatList from "~/components/ChatList";
import EditIcon from "~/components/icons/EditIcon";
import DeleteIcon from "~/components/icons/DeleteIcon";

import type { Document } from "@prisma/client";

export default function Settings() {
  useAuthRedirect();
  const router = useRouter();
  const { chats, isLoading, error, createChat, editChat, deleteChat } =
    useChats();
  const {
    documents,
    isLoading: isDocsLoading,
    error: docsError,
    handleUpload: originalHandleUpload,
    handleEdit,
    handleDelete,
    handleEmbeddings,
  } = useDocs();

  if (isLoading || isDocsLoading) return <LoadingPage />;
  if (error ?? docsError) return <ErrorPage />;

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      await originalHandleUpload(file.name, content);
      await handleEmbeddings(content);
    };
    reader.readAsText(file);
  };

  const onEdit = async (id: string) => {
    const doc = documents.find((document) => document.id === id);
    if (!doc) return;

    const newTitle = prompt("New title:", doc.title);
    if (newTitle) {
      await handleEdit(id, newTitle);
    }
  };

  const onDelete = async (id: string) => {
    await handleDelete(id);
  };

  return (
    <>
      <Header
        title="Vectorwave | Settings"
        content="View and manage your files here."
      />
      <main className="flex">
        <ChatList
          chats={chats}
          isNewChat={false}
          onNewChat={createChat}
          onEditChat={editChat}
          onDeleteChat={deleteChat}
          onChatSelect={(chat) => router.push(`/chats/${chat.id}`)}
        />
        <div className="flex w-full flex-col">
          <header className="mx-auto my-10 text-center">
            <h1 className="text-2xl font-bold">Document Settings</h1>
          </header>
          <button
            className="mx-auto my-4 rounded-lg bg-blue-500 p-2 text-white"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            Upload Document
          </button>
          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            onChange={handleUpload}
          />
          <DocumentList
            documents={documents}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </main>
    </>
  );
}

interface Props {
  documents: Document[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function DocumentList({ documents, onEdit, onDelete }: Props) {
  return (
    <table className="mx-auto w-3/4 border-collapse text-center">
      <thead>
        <tr className="bg-black text-white">
          <th className="p-2">Document Name</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {documents.map((doc, index) => (
          <tr
            key={doc.id}
            className={
              index % 2 === 0
                ? "bg-gray-600 text-white"
                : "bg-gray-700 text-white"
            }
          >
            <td className="p-2">{doc.title}</td>
            <td>
              <button
                onClick={() => onEdit(doc.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                <EditIcon />
              </button>
            </td>
            <td>
              <button
                onClick={() => onDelete(doc.id)}
                className="text-red-500 hover:text-red-700"
              >
                <DeleteIcon />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
