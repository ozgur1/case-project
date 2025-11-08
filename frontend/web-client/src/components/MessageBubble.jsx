// frontend/web-client/src/components/MessageBubble.jsx
export default function MessageBubble({ me, msg }) {
  return (
    <div
      className={`flex ${
        me ? "justify-end" : "justify-start"
      } items-end w-full gap-2`}
    >
      {/* karşı tarafın emojisi */}
      {!me && (
        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-lg shadow-sm">
          {msg.emoji || "💬"}
        </div>
      )}

      {/* balon */}
      <div
        className={`max-w-[70%] rounded-2xl px-3 py-2 shadow-sm ${
          me ? "bg-blue-600 text-white" : "bg-white text-slate-900"
        }`}
      >
        {/* mesaj */}
        <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">
          {msg.content}
        </div>

        {/* sentiment */}
        <div
          className={`mt-1 text-[11px] opacity-70 ${
            me ? "text-blue-100 text-right" : "text-slate-500"
          }`}
        >
          {msg.sentiment}
        </div>
      </div>

      {/* benim emoji sağda */}
      {me && (
        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-lg shadow-sm">
          {msg.emoji || "💬"}
        </div>
      )}
    </div>
  );
}
