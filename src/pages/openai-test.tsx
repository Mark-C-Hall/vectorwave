import { useState } from "react";
import toast from "react-hot-toast";

import { api } from "~/utils/api";

export default function OpenAITest() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  // Initialize the mutation hook
  const { mutate, isLoading, error } = api.openai.hello.useMutation({
    onSuccess: (data) => {
      // Update the response state with the data received from the server
      setResponse(data.response ?? "");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Use the mutate function to trigger the mutation
    mutate({ prompt });
  };

  return (
    <div>
      <h1>OpenAI API Test</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
        />
        <button type="submit" disabled={isLoading}>
          Submit
        </button>
      </form>
      {response && (
        <div>
          <strong>Response:</strong> {response}
        </div>
      )}
      {error && <div>An error occurred: {error.message}</div>}
    </div>
  );
}
