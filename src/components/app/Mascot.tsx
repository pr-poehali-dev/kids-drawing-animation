import { Tab } from "./types";

// ======== CONFETTI ========
export function Confetti({ active }: { active: boolean }) {
  const shapes = ["⭐", "🎉", "✨", "🌟", "💫", "🎈"];
  const colors = ["#FFD93D", "#FF6B9D", "#C084FC", "#38BDF8", "#34D399", "#FB923C"];
  if (!active) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece flex items-center justify-center text-lg"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${1.5 + Math.random() * 1.5}s`,
            animationDelay: `${Math.random() * 0.5}s`,
            color: colors[i % colors.length],
          }}
        >
          {shapes[i % shapes.length]}
        </div>
      ))}
    </div>
  );
}

// ======== MASCOT ========
export function Mascot({ mood, message }: { mood: "happy" | "excited" | "thinking" | "sleeping"; message?: string }) {
  const faces = { happy: "😊", excited: "🤩", thinking: "🤔", sleeping: "😴" };
  return (
    <div className="flex flex-col items-start gap-2">
      {message && (
        <div className="speech-bubble bg-white rounded-2xl px-4 py-3 shadow-md max-w-xs border border-orange-100">
          <p className="text-sm font-bold text-foreground font-nunito">{message}</p>
        </div>
      )}
      <div className="flex items-center gap-3">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl animate-float cursor-pointer select-none"
          style={{
            background: "linear-gradient(135deg, #FFD93D, #FF6B9D)",
            boxShadow: "0 4px 20px rgba(255, 107, 157, 0.4)",
          }}
        >
          {faces[mood]}
        </div>
        <div>
          <p className="font-black text-sm font-nunito text-foreground">Лучик</p>
          <p className="text-xs text-muted-foreground font-nunito">твой помощник</p>
        </div>
      </div>
    </div>
  );
}

// ======== BOTTOM NAV ========
const NAV_TABS = [
  { id: "editor", emoji: "🎨", label: "Редактор" },
  { id: "gallery", emoji: "🖼️", label: "Галерея" },
  { id: "voice", emoji: "🎤", label: "Озвучка" },
  { id: "helper", emoji: "⭐", label: "Помощник" },
  { id: "profile", emoji: "👤", label: "Профиль" },
  { id: "settings", emoji: "🔒", label: "Защита" },
] as const;

export function BottomNav({ active, onSelect }: { active: Tab; onSelect: (t: Tab) => void }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2"
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderTop: "2px solid hsl(var(--border))",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
      }}
    >
      {NAV_TABS.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t.id as Tab)}
            className="tab-btn flex flex-col items-center gap-0.5 px-2 py-1 rounded-2xl transition-all"
            style={
              isActive
                ? { background: "linear-gradient(135deg, #FFD93D22, #FF6B9D22)", transform: "scale(1.1)" }
                : {}
            }
          >
            <span className="text-2xl leading-none">{t.emoji}</span>
            <span
              className="text-[10px] font-bold font-nunito"
              style={{ color: isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
