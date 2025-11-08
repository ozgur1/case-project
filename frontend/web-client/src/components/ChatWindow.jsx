// frontend/web-client/src/components/ChatWindow.jsx
import { useEffect, useRef, useState } from "react";
import { api } from "../api";
import MessageBubble from "./MessageBubble.jsx";

export default function ChatWindow({
  currentUser,
  selectedConversation,
  draftNickname,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const scrollerRef = useRef(null);

  const isDraft = !!draftNickname;

  async function loadMessages() {
    if (!selectedConversation?.conversationId) return;

    try {
      const data = await api.messagesOfConversation(
        selectedConversation.conversationId
      );
      setMessages(data || []);
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => {
    setMessages([]);
    setErr("");
    setInput("");

    if (!isDraft) {
      loadMessages();
      const iv = setInterval(loadMessages, 1500);
      return () => clearInterval(iv);
    }
  }, [selectedConversation?.conversationId, isDraft]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function send() {
    if (!input.trim()) return;

    setSending(true);
    setErr("");

    try {
      let receiverId;

      if (isDraft) {
        const users = await api.listUsers();
        const target = users.find(
          (u) => u.nickname?.toLowerCase() === draftNickname?.toLowerCase()
        );

        if (!target) {
          setErr("Bu rumuzda kullanıcı yok.");
          setSending(false);
          return;
        }

        receiverId = target.id;
      } else {
        receiverId = selectedConversation.otherUserId;
        if (!receiverId) {
          setErr("Hedef kullanıcı bulunamadı.");
          setSending(false);
          return;
        }
      }

      await api.sendMessageToUser(receiverId, currentUser.id, input.trim());
      setInput("");

      if (!isDraft) loadMessages();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSending(false);
    }
  }

  const title = isDraft
    ? `Yeni sohbet: ${draftNickname}`
    : selectedConversation?.otherNickname || "Sohbet";

  return (
    <div className="flex-1 h-full flex flex-col bg-white">
      {/* header */}
      <div className="h-14 border-b border-slate-200 px-4 flex items-center bg-white shadow-sm">
        <div className="font-semibold text-slate-800 text-lg">{title}</div>
      </div>

      {/* messages */}
      <div
        ref={scrollerRef}
        className="flex-1 overflow-y-auto p-4 bg-slate-100/70"
      >
        {err && <div className="text-red-600 text-sm">{err}</div>}

        <div className="space-y-2 mt-2">
          {messages.map((m) => (
            <MessageBubble
              key={m.id}
              me={m.senderId === currentUser.id}
              msg={m}
            />
          ))}
        </div>
      </div>

      {/* input bar */}
      <div className="h-16 border-t bg-white px-3 py-2 flex items-center gap-2 shadow-inner">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Mesaj yaz..."
          className="flex-1 rounded-xl border px-3 py-2 text-sm bg-slate-50 focus:bg-white"
        />
        <button
          onClick={send}
          disabled={sending || !input.trim()}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          Gönder
        </button>
      </div>
    </div>
  );
}
