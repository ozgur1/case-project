// frontend/web-client/src/components/AuthGate.jsx
import { useEffect, useState } from "react";
import { api } from "../api";

export default function AuthGate({ onAuthed }) {
  const [nick, setNick] = useState("");
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u?.id) onAuthed(u);
      } catch {}
    }
  }, [onAuthed]);

  async function submit() {
    setErr("");
    if (!nick.trim()) {
      setErr("Rumuz boş olamaz.");
      return;
    }
    setLoading(true);
    try {
      const user =
        mode === "login" ? await api.login(nick.trim()) : await api.register(nick.trim());
      localStorage.setItem("currentUser", JSON.stringify(user));
      onAuthed(user);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-6">
        <h1 className="text-xl font-semibold mb-1 text-slate-800">Sohbete Giriş</h1>
        <p className="text-sm text-slate-500 mb-6">
          Sadece rumuzla {mode === "login" ? "giriş yap" : "kayıt ol"}.
        </p>

        <label className="text-sm text-slate-600">Rumuz</label>
        <input
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring focus:ring-blue-200"
          placeholder="ör. Ozgur"
          value={nick}
          onChange={(e) => setNick(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />

        {err && <div className="mt-3 text-sm text-red-600">{err}</div>}

        <button
          onClick={submit}
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-blue-600 text-white py-2.5 font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Gönderiliyor..." : mode === "login" ? "Giriş yap" : "Kayıt ol"}
        </button>

        <div className="mt-4 text-sm text-slate-600">
          {mode === "login" ? (
            <>
              Hesabın yok mu?{" "}
              <button className="text-blue-600" onClick={() => setMode("register")}>
                Kayıt ol
              </button>
            </>
          ) : (
            <>
              Zaten hesabın var mı?{" "}
              <button className="text-blue-600" onClick={() => setMode("login")}>
                Giriş yap
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
