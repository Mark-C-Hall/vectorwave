import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { api } from "~/utils/api";

import type { Document } from "@prisma/client";

export default function useDocs() {
  const [documents, setDocuments] = useState<Document[]>([]);

  // Use an API query to fetch documents for a given user ID.
  const {
    data: fetchedDocuments,
    isLoading: isDocumentsLoading,
    error: fetchDocumentsError,
  } = api.document.getDocumentsByUser.useQuery();

  // Define mutations for uploading, editing, and deleting documents.
  const {
    mutateAsync: uploadDocument,
    isLoading: isUploadLoading,
    error: uploadError,
  } = api.document.uploadFile.useMutation({
    onError: (error) => toast.error(error.message),
  });

  const {
    mutateAsync: editDocument,
    isLoading: isEditLoading,
    error: editError,
  } = api.document.editDocument.useMutation({
    onError: (error) => toast.error(error.message),
  });

  const {
    mutateAsync: deleteDocument,
    isLoading: isDeleteLoading,
    error: deleteError,
  } = api.document.deleteDocument.useMutation({
    onError: (error) => toast.error(error.message),
  });

  // Mutation for embedding text and removing embeddings.
  const {
    mutateAsync: embedFile,
    isLoading: isEmbeddingsLoading,
    error: embeddingsError,
  } = api.openai.embedFile.useMutation({
    onError: (error) => toast.error(error.message),
  });

  const {
    mutateAsync: removeEmbeddings,
    isLoading: isRemoveEmbeddingsLoading,
    error: removeEmbeddingsError,
  } = api.openai.removeEmbeddings.useMutation({
    onError: (error) => toast.error(error.message),
  });

  // Upload a new document.
  const handleUpload = async (title: string, content: string) => {
    try {
      if (isUploadLoading || isEmbeddingsLoading) {
        console.error("Mutation is already in progress");
        return;
      }
      const newDoc = await uploadDocument({ title, content });
      await embedFile({ docId: newDoc.id, text: content });
      setDocuments([...documents, newDoc]);
    } catch (error) {
      console.error("Error uploading document: ", error);
    }
  };

  // Edit document title.
  const handleEdit = async (id: string, title: string) => {
    try {
      if (isEditLoading) {
        console.error("Mutation is already in progress");
        return;
      }
      await editDocument({ id, title });
      const updatedDocs = documents.map((doc) =>
        doc.id === id ? { ...doc, title } : doc,
      );
      setDocuments(updatedDocs);
    } catch (error) {
      console.error("Error editing document: ", error);
    }
  };

  // Delete a document.
  const handleDelete = async (id: string) => {
    try {
      if (isDeleteLoading || isRemoveEmbeddingsLoading) {
        console.error("Mutation is already in progress");
        return;
      }
      await deleteDocument(id);
      await removeEmbeddings({ docId: id });
      const updatedDocs = documents.filter((doc) => doc.id !== id);
      setDocuments(updatedDocs);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  useEffect(() => {
    if (fetchedDocuments) {
      setDocuments(fetchedDocuments);
    }
  }, [fetchedDocuments]);

  return {
    documents,
    isLoading:
      isDocumentsLoading ||
      isUploadLoading ||
      isEditLoading ||
      isDeleteLoading ||
      isEmbeddingsLoading ||
      isRemoveEmbeddingsLoading,
    error:
      fetchDocumentsError ??
      uploadError ??
      editError ??
      deleteError ??
      embeddingsError ??
      removeEmbeddingsError,
    handleUpload,
    handleEdit,
    handleDelete,
  };
}
