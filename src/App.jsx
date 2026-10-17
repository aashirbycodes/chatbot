
import { useState } from "react";
import axios from "axios";

function App() {
  const [userQuery, setUserQuery] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const userMsg = userQuery.trim();

    if (!userMsg || loading) return;

    setConversation((prev) => [
      ...prev,
      { role: "user", message: userMsg },
    ]);

    setUserQuery("");
    setLoading(true);

    try {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

      if (!API_KEY) {
        throw new Error("API key .env file mein nahi mili.");
      }

      const apiRes = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
        {
          contents: [
            {
              parts: [{ text: userMsg }],
            },
          ],
        },
        {
          headers: {
            "x-goog-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      const reply =
        apiRes.data?.candidates?.[0]?.content?.parts
          ?.map((part) => part.text || "")
          .join("") || "Gemini se text reply nahi mila.";

      setConversation((prev) => [
        ...prev,
        { role: "assistant", message: reply },
      ]);
    } catch (error) {
      console.error(
        "API Error:",
        error.response?.data || error.message
      );

      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          message:
            error.response?.data?.error?.message ||
            error.message ||
            "Kuch ghalat ho gaya.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div>
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={
              msg.role === "user"
                ? "user-message"
                : "assistant-message"
            }
          >
            <strong>
              {msg.role === "user" ? "You" : "Assistant"}:
            </strong>{" "}
            {msg.message}
          </div>
        ))}

        {loading && <p>Gemini is thinking...</p>}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="userQuery"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

export default App;
