<div className="bg-red-500 text-white p-4 text-xl">
  Tailwind çalışıyor!
</div>

// frontend/web-client/src/App.jsx
import { useCallback, useState } from "react";
import AuthGate from "./components/AuthGate.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ChatWindow from "./components/ChatWindow.jsx";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [draftNickname, setDraftNickname] = useState(null);

  const onAuthed = useCallback((u) => {
    setCurrentUser(u);
  }, []);

  function logout() {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setSelectedConversation(null);
    setDraftNickname(null);
  }

  if (!currentUser) return <AuthGate onAuthed={onAuthed} />;

  return (
    <div className="min-h-screen h-screen flex flex-col">
      <div className="h-12 border-b border-slate-200 flex items-center justify-between px-4">
        <div className="font-semibold text-slate-800">💬 Mini Chat + Sentiment</div>
        <button onClick={logout} className="text-sm text-slate-500 hover:text-slate-700">
          Çıkış
        </button>
      </div>

      <div className="flex flex-1">
        <Sidebar
          currentUser={currentUser}
          selectedId={selectedConversation?.conversationId}
          onSelectConversation={(c) => {
            setDraftNickname(null);
            setSelectedConversation(c);
          }}
          onStartDraft={(nick) => {
            setSelectedConversation(null);
            setDraftNickname(nick);
          }}
        />

        <ChatWindow
          currentUser={currentUser}
          selectedConversation={selectedConversation}
          draftNickname={draftNickname}
        />
      </div>
    </div>
  );
}
