import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Mascot } from "./Mascot";
import { Drawing, MOCK_DRAWINGS } from "./types";

// ======== GALLERY TAB ========
export function GalleryTab() {
  const [selected, setSelected] = useState<Drawing | null>(null);
  const [filter, setFilter] = useState<"all" | "animated" | "voiced">("all");

  const filtered = MOCK_DRAWINGS.filter((d) => {
    if (filter === "animated") return d.hasAnimation;
    if (filter === "voiced") return d.hasVoice;
    return true;
  });

  if (selected) {
    return (
      <div className="flex flex-col gap-4 animate-bounce-in">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-sm font-bold font-nunito text-muted-foreground"
        >
          <Icon name="ArrowLeft" size={16} /> Назад
        </button>
        <div
          className="w-full rounded-3xl flex items-center justify-center relative overflow-hidden"
          style={{
            height: 240,
            background: `linear-gradient(135deg, ${selected.color}44, ${selected.color}22)`,
            border: `3px solid ${selected.color}`,
          }}
        >
          <div className="text-8xl" style={{ animation: selected.hasAnimation ? "float 3s ease-in-out infinite" : "none" }}>
            {selected.emoji}
          </div>
          {selected.hasAnimation && (
            <div className="absolute top-4 right-4 text-3xl" style={{ animation: "float 2s ease-in-out infinite 0.5s" }}>✨</div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-black font-nunito">{selected.name}</h2>
          <p className="text-sm text-muted-foreground font-nunito">{selected.date}</p>
        </div>
        <div className="flex gap-2">
          {selected.hasAnimation && (
            <span className="px-3 py-1 rounded-xl text-xs font-bold font-nunito"
              style={{ background: "#34D39922", color: "#059669" }}>✨ Анимация</span>
          )}
          {selected.hasVoice && (
            <span className="px-3 py-1 rounded-xl text-xs font-bold font-nunito"
              style={{ background: "#FF6B9D22", color: "#DB2777" }}>🎤 Голос</span>
          )}
        </div>
        <div className="flex gap-3">
          <button
            className="flex-1 py-3 rounded-2xl font-bold font-nunito text-sm text-white"
            style={{ background: "linear-gradient(135deg, #FFD93D, #FF6B9D)" }}
          >
            ▶ Смотреть
          </button>
          <button
            className="flex-1 py-3 rounded-2xl font-bold font-nunito text-sm"
            style={{ background: "hsl(var(--muted))", color: "hsl(var(--foreground))" }}
          >
            🎤 Озвучить
          </button>
          <button
            className="py-3 px-4 rounded-2xl font-bold font-nunito text-sm"
            style={{ background: "hsl(var(--muted))", color: "hsl(var(--foreground))" }}
          >
            📤
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black font-nunito">Мои рисунки</h2>
        <span className="text-sm font-bold font-nunito px-3 py-1 rounded-xl"
          style={{ background: "hsl(var(--muted))" }}>
          {filtered.length} штук
        </span>
      </div>

      <div className="flex gap-2">
        {[
          { id: "all", label: "Все 🎨" },
          { id: "animated", label: "Анимация ✨" },
          { id: "voiced", label: "Голос 🎤" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as typeof filter)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold font-nunito transition-all"
            style={
              filter === f.id
                ? { background: "hsl(var(--primary))", color: "white" }
                : { background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filtered.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelected(d)}
            className="fun-card rounded-3xl overflow-hidden text-left"
          >
            <div
              className="flex items-center justify-center"
              style={{ height: 110, background: `linear-gradient(135deg, ${d.color}44, ${d.color}22)` }}
            >
              <span className="text-5xl">{d.emoji}</span>
            </div>
            <div className="p-3 bg-white">
              <p className="font-bold font-nunito text-sm text-foreground truncate">{d.name}</p>
              <p className="text-xs text-muted-foreground font-nunito">{d.date}</p>
              <div className="flex gap-1 mt-1">
                {d.hasAnimation && <span className="text-xs">✨</span>}
                {d.hasVoice && <span className="text-xs">🎤</span>}
              </div>
            </div>
          </button>
        ))}

        <button
          className="rounded-3xl border-4 border-dashed border-orange-200 flex items-center justify-center"
          style={{ height: 176, background: "#FFD93D11" }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">➕</span>
            <span className="text-xs font-bold font-nunito text-orange-400">Добавить</span>
          </div>
        </button>
      </div>
    </div>
  );
}

// ======== VOICE TAB ========
export function VoiceTab() {
  const [recording, setRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [selectedDrawing, setSelectedDrawing] = useState(MOCK_DRAWINGS[0]);
  const [mode, setMode] = useState<"record" | "upload">("record");

  const handleRecord = () => {
    if (!recording) {
      setRecording(true);
    } else {
      setRecording(false);
      setHasRecording(true);
    }
  };

  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      <Mascot
        mood={recording ? "excited" : "happy"}
        message={recording ? "Слушаю тебя! Говори в микрофон! 🎤" : "Выбери рисунок и добавь голос к анимации!"}
      />

      <div>
        <label className="font-black font-nunito text-sm text-foreground mb-2 block">🎨 Выбери рисунок</label>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {MOCK_DRAWINGS.slice(0, 4).map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDrawing(d)}
              className="flex-shrink-0 flex flex-col items-center gap-1"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all"
                style={{
                  background: `linear-gradient(135deg, ${d.color}44, ${d.color}22)`,
                  border: selectedDrawing.id === d.id ? `3px solid ${d.color}` : "3px solid transparent",
                  transform: selectedDrawing.id === d.id ? "scale(1.1)" : "scale(1)",
                }}
              >
                {d.emoji}
              </div>
              <span className="text-[10px] font-bold font-nunito text-center w-16 truncate">{d.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex rounded-2xl p-1 gap-1" style={{ background: "hsl(var(--muted))" }}>
        {[
          { id: "record", label: "🎤 Записать голос" },
          { id: "upload", label: "📁 Загрузить файл" },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as typeof mode)}
            className="flex-1 py-2 rounded-xl text-sm font-bold font-nunito transition-all"
            style={
              mode === m.id
                ? { background: "white", color: "hsl(var(--foreground))", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }
                : { color: "hsl(var(--muted-foreground))" }
            }
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "record" ? (
        <div className="flex flex-col items-center gap-5">
          <div
            className="w-full rounded-2xl flex items-center justify-center gap-1 px-4"
            style={{ height: 80, background: "hsl(var(--muted))" }}
          >
            {recording ? (
              Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.07}s`, height: 8 }} />
              ))
            ) : hasRecording ? (
              Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full"
                  style={{
                    height: [12, 20, 16, 28, 14, 24, 18, 22, 14, 20, 16, 18, 12, 16][i] || 12,
                    background: "hsl(var(--primary))",
                    opacity: 0.7,
                  }}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground font-nunito">Нажми кнопку и говори!</p>
            )}
          </div>

          <button
            onClick={handleRecord}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all ${
              recording ? "animate-recording" : "animate-pulse-ring"
            }`}
            style={{
              background: recording
                ? "linear-gradient(135deg, #ef4444, #dc2626)"
                : "linear-gradient(135deg, #FF6B9D, #C084FC)",
              boxShadow: recording
                ? "0 8px 32px rgba(239,68,68,0.5)"
                : "0 8px 32px rgba(255,107,157,0.4)",
            }}
          >
            {recording ? "⏹" : "🎤"}
          </button>

          <p className="text-sm font-bold font-nunito text-muted-foreground">
            {recording ? "Запись идёт... Говори!" : "Нажми для записи"}
          </p>

          {hasRecording && !recording && (
            <div className="flex gap-3 w-full animate-slide-up">
              <button
                className="flex-1 py-3 rounded-2xl font-bold font-nunito text-sm"
                style={{ background: "hsl(var(--muted))", color: "hsl(var(--foreground))" }}
              >
                ▶ Слушать
              </button>
              <button
                onClick={() => setHasRecording(false)}
                className="flex-1 py-3 rounded-2xl font-bold font-nunito text-sm"
                style={{ background: "#ef444422", color: "#dc2626" }}
              >
                🗑 Удалить
              </button>
              <button
                className="flex-1 py-3 rounded-2xl font-bold font-nunito text-sm text-white"
                style={{ background: "linear-gradient(135deg, #34D399, #38BDF8)" }}
              >
                ✅ Добавить
              </button>
            </div>
          )}

          <div
            className="w-full rounded-2xl p-4 border-2"
            style={{ borderColor: "#C084FC55", background: "#C084FC11" }}
          >
            <p className="font-black font-nunito text-sm mb-2" style={{ color: "#7C3AED" }}>🤖 Или AI-голос</p>
            <div className="flex gap-2 flex-wrap">
              {["👦 Мальчик", "👧 Девочка", "🧙 Волшебник", "🦁 Лев"].map((v) => (
                <button
                  key={v}
                  className="px-3 py-1 rounded-xl text-xs font-bold font-nunito"
                  style={{ background: "#C084FC33", color: "#7C3AED" }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div
            className="w-full rounded-3xl border-4 border-dashed border-pink-200 flex flex-col items-center justify-center gap-3 cursor-pointer"
            style={{ height: 160, background: "#FF6B9D11" }}
          >
            <span className="text-5xl">📁</span>
            <p className="font-bold font-nunito text-sm text-pink-400">Загрузи аудиофайл</p>
            <p className="text-xs text-muted-foreground font-nunito">MP3, WAV, M4A</p>
          </div>
          <div
            className="w-full rounded-2xl p-4 border-2"
            style={{ borderColor: "#34D39955", background: "#34D39911" }}
          >
            <p className="font-black font-nunito text-sm" style={{ color: "#059669" }}>🎵 Авто-звуки и музыка</p>
            <p className="text-xs text-muted-foreground font-nunito mt-1">Нейросеть добавит контекстные звуки и фоновую музыку</p>
            <button
              className="mt-3 px-4 py-2 rounded-xl font-bold font-nunito text-xs text-white"
              style={{ background: "linear-gradient(135deg, #34D399, #38BDF8)" }}
            >
              ✨ Создать автоматически
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
