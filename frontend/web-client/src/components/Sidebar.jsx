console.log("✅ Sidebar loaded from:", import.meta.url);

// frontend/web-client/src/components/Sidebar.jsx
import { useEffect, useState } from "react";
import { api } from "../api";

export default function Sidebar({
  currentUser,
  selectedId,
  onSelectConversation,
  onStartDraft,
}) {
  const [conversations, setConversations] = useState([]);
  const [draftNick, setDraftNick] = useState("");
  const [locallyRead, setLocallyRead] = useState({});

  async function load() {
    try {
      const data = await api.conversationsOf(currentUser.id);

      const updated = data.map((c) => {
        const hasUnread =
          !!c.lastMessage &&
          c.lastSenderId !== currentUser.id &&
          locallyRead[c.conversationId] !== true;

        return { ...c, hasUnread };
      });

      setConversations(updated);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    load();
    const iv = setInterval(load, 1500);
    return () => clearInterval(iv);
  }, [currentUser.id, locallyRead]);

  function handleStartDraft() {
    if (!draftNick.trim()) return;
    onStartDraft(draftNick.trim());
    setDraftNick("");
  }

  function handleSelect(c) {
    onSelectConversation({
      conversationId: c.conversationId,
      otherUserId: c.otherUser?.id,
      otherNickname: c.otherUser?.nickname,
    });

    setLocallyRead((prev) => ({
      ...prev,
      [c.conversationId]: true,
    }));
  }

  return (
    <div className="w-72 border-r border-slate-300 flex flex-col bg-white">
      {/* HEADER */}
      <div className="h-14 px-4 border-b border-slate-200 flex items-center">
        <div className="font-semibold text-slate-800 text-lg">💬 Mini Chat</div>
      </div>

      {/* current user */}
      <div className="px-4 py-3 text-sm text-slate-600 border-b border-slate-200">
        Giriş yapan: <span className="font-semibold">{currentUser.nickname}</span>
      </div>

      {/* new chat */}
      <div className="p-3 border-b border-slate-200 flex gap-2 bg-slate-50">
        <input
          className="flex-1 rounded-lg border px-3 py-2 text-sm"
          placeholder="Rumuz yaz..."
          value={draftNick}
          onChange={(e) => setDraftNick(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleStartDraft()}
        />
        <button
          onClick={handleStartDraft}
          className="rounded-lg px-3 py-2 bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          Başlat
        </button>
      </div>

      {/* conversation list */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((c) => {
          const isActive = selectedId === c.conversationId;

          return (
            <div
              key={c.conversationId}
              onClick={() => handleSelect(c)}
              className={`
                px-4 py-3 cursor-pointer border-b border-slate-100
                transition-all
                ${
                  isActive
                    ? "bg-blue-50"
                    : c.hasUnread
                    ? "bg-blue-100/40"
                    : "bg-white"
                }
                hover:bg-slate-100
              `}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium text-slate-800 text-[15px]">
                  {c.otherUser?.nickname || "—"}
                </div>

                {/* unread badge */}
                {!isActive && c.hasUnread && (
                  <div className="min-w-[20px] h-[20px] bg-blue-600 rounded-full flex items-center justify-center text-[11px] text-white shadow">
                    1
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-500 truncate mt-1">
                {c.lastMessage || "Mesaj yok"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
