
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
      const API_KEY = import.meta.env.GEMINI_API_KEY;

      if (!API_KEY) {
        throw new Error("API key .env file mein nahi mili.");
      }

      const apiRes = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
        {
          contents: [
            {
              parts: [{ text: "you are a Full Stack Web developer and AI Automation named Syed Aashir Ali. Answer the User Query in a Concise and clear manner, maximum 1 to 2 Lines. if the user asks about something outside your domain, politely decline to answer." }

                ,
                {
                  text: userMsg,
                }
              ],
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
    <main className="min-h-screen bg-slate-50 px-4 py-5 text-slate-900 sm:px-6 sm:py-8">
      <section className="mx-auto flex h-[calc(100svh-2.5rem)] min-h-[32rem] max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 sm:h-[calc(100svh-4rem)]">
        <header className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-7">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-6">
              <path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.64 5.64l1.42 1.42m9.88 9.88 1.42 1.42m0-12.72-1.42 1.42m-9.88 9.88-1.42 1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">Syed AI Assistant</h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 sm:text-sm">
              <span className="size-2 rounded-full bg-emerald-500" />
              Ready to help
            </p>
          </div>
        </header>

        <div
          aria-live="polite"
          className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8"
        >
          {conversation.length === 0 ? (
            <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
              <div className="mb-5 flex size-16 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-8">
                  <path d="M8 10h8M8 14h5m-7 6 2.5-2H18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12l2-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">How can I help you today?</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Ask me about full-stack development or AI automation.
              </p>
            </div>
          ) : (
            conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[75%] sm:px-5 ${
                    msg.role === "user"
                      ? "rounded-br-md bg-indigo-600 text-white"
                      : "rounded-bl-md border border-slate-200 bg-slate-50 text-slate-700"
                  }`}
                >
                  <p className={`mb-1 text-xs font-semibold ${msg.role === "user" ? "text-indigo-100" : "text-slate-500"}`}>
                    {msg.role === "user" ? "You" : "Syed AI"}
                  </p>
                  <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-3 rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                <span className="flex gap-1" aria-hidden="true">
                  <span className="size-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.3s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.15s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-indigo-500" />
                </span>
                <span>Thinking...</span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-slate-100 bg-white p-4 sm:px-7 sm:py-5">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-100">
            <input
              type="text"
              name="userQuery"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Message Syed AI..."
              aria-label="Your message"
              disabled={loading}
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={loading || !userQuery.trim()}
              aria-label={loading ? "Sending message" : "Send message"}
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
                <path d="m5 12 14-7-4 14-3-6-7-1Zm7 1 7-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-slate-400">
            Syed AI can make mistakes. Check important information.
          </p>
        </form>
      </section>
    </main>
  );
}

export default App;
