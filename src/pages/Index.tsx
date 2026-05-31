import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

// ======== TYPES ========
type Tab = "editor" | "gallery" | "voice" | "helper" | "profile" | "settings";

interface Drawing {
  id: string;
  name: string;
  date: string;
  emoji: string;
  color: string;
  hasAnimation: boolean;
  hasVoice: boolean;
}

// ======== MOCK DATA ========
const MOCK_DRAWINGS: Drawing[] = [
  { id: "1", name: "Дракончик Пыша", date: "28 мая", emoji: "🐉", color: "#FFD93D", hasAnimation: true, hasVoice: true },
  { id: "2", name: "Принцесса Звёздочка", date: "25 мая", emoji: "👸", color: "#FF6B9D", hasAnimation: true, hasVoice: false },
  { id: "3", name: "Кот-волшебник", date: "20 мая", emoji: "🐱", color: "#C084FC", hasAnimation: false, hasVoice: false },
  { id: "4", name: "Радужный замок", date: "15 мая", emoji: "🏰", color: "#38BDF8", hasAnimation: false, hasVoice: false },
  { id: "5", name: "Весёлый робот", date: "10 мая", emoji: "🤖", color: "#34D399", hasAnimation: true, hasVoice: true },
  { id: "6", name: "Летающий кит", date: "5 мая", emoji: "🐋", color: "#FB923C", hasAnimation: false, hasVoice: false },
];

// ======== CONFETTI ========
function Confetti({ active }: { active: boolean }) {
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
function Mascot({ mood, message }: { mood: "happy" | "excited" | "thinking" | "sleeping"; message?: string }) {
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

// ======== NAV ========
const NAV_TABS = [
  { id: "editor", emoji: "🎨", label: "Редактор" },
  { id: "gallery", emoji: "🖼️", label: "Галерея" },
  { id: "voice", emoji: "🎤", label: "Озвучка" },
  { id: "helper", emoji: "⭐", label: "Помощник" },
  { id: "profile", emoji: "👤", label: "Профиль" },
  { id: "settings", emoji: "🔒", label: "Защита" },
] as const;

function BottomNav({ active, onSelect }: { active: Tab; onSelect: (t: Tab) => void }) {
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

// ======== EDITOR TAB ========
function EditorTab({ onAnimate }: { onAnimate: () => void }) {
  const [uploaded, setUploaded] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isRecordingPrompt, setIsRecordingPrompt] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setUploaded(true);
  };

  const handleAnimate = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
      onAnimate();
    }, 3000);
  };

  const handleVoicePrompt = () => {
    setIsRecordingPrompt((prev) => !prev);
    if (isRecordingPrompt) {
      setPrompt("Мой дракончик летит в небе и дышит огнём!");
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-12 animate-bounce-in">
        <div className="text-8xl animate-float">🐉</div>
        <div className="text-center">
          <h2 className="text-2xl font-black font-nunito text-foreground">Рисунок ожил!</h2>
          <p className="text-muted-foreground font-nunito mt-1">Твой дракончик теперь летает и дышит огнём!</p>
        </div>
        <div
          className="w-full max-w-sm rounded-3xl overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, #FFD93D33, #FF6B9D33)", border: "3px solid #FFD93D", height: 200 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-7xl animate-float">🐉</div>
            <div className="absolute top-4 right-4 text-3xl" style={{ animation: "float 2s ease-in-out infinite 0.5s" }}>🔥</div>
            <div className="absolute bottom-4 left-8 text-2xl" style={{ animation: "float 3s ease-in-out infinite 1s" }}>✨</div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold font-nunito px-3 py-1 rounded-full"
              style={{ background: "rgba(0,0,0,0.2)", color: "white" }}>
              ▶ Воспроизведение
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setDone(false); setUploaded(false); setPrompt(""); }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold font-nunito text-sm"
            style={{ background: "hsl(var(--muted))", color: "hsl(var(--foreground))" }}
          >
            <span>🎨</span> Новый
          </button>
          <button
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold font-nunito text-sm text-white"
            style={{ background: "linear-gradient(135deg, #34D399, #38BDF8)" }}
          >
            <span>💾</span> Сохранить
          </button>
          <button
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold font-nunito text-sm text-white"
            style={{ background: "linear-gradient(135deg, #FF6B9D, #C084FC)" }}
          >
            <span>🎤</span> Озвучить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      <Mascot
        mood={processing ? "thinking" : uploaded ? "excited" : "happy"}
        message={
          processing
            ? "Оживляю твой рисунок... волшебство происходит! ✨"
            : uploaded
            ? "Отлично! Теперь расскажи мне, что должно произойти в анимации!"
            : "Привет! Загрузи свой рисунок, и я его оживлю! 🌟"
        }
      />

      {/* Upload Zone */}
      <div
        className={`relative rounded-3xl border-4 border-dashed transition-all cursor-pointer ${
          uploaded ? "border-mint" : "border-orange-300"
        }`}
        style={{
          minHeight: 200,
          background: uploaded
            ? "linear-gradient(135deg, #34D39922, #38BDF822)"
            : "linear-gradient(135deg, #FFD93D11, #FF6B9D11)",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !uploaded && fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={() => setUploaded(true)} />
        {uploaded ? (
          <div className="flex flex-col items-center justify-center gap-3 p-8">
            <div className="text-6xl animate-bounce-in">🎨</div>
            <p className="font-bold font-nunito text-mint">Рисунок загружен!</p>
            <button
              onClick={(e) => { e.stopPropagation(); setUploaded(false); }}
              className="text-xs text-muted-foreground underline font-nunito"
            >
              Загрузить другой
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 p-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl animate-pulse-ring"
              style={{ background: "linear-gradient(135deg, #FFD93D, #FF6B9D)" }}
            >
              📸
            </div>
            <div className="text-center">
              <p className="font-black font-nunito text-lg text-foreground">Загрузи свой рисунок!</p>
              <p className="text-sm text-muted-foreground font-nunito mt-1">Нажми или перетащи сюда</p>
            </div>
            <div className="flex gap-3">
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-nunito"
                style={{ background: "#FFD93D33", color: "#B45309" }}>📷 Камера</span>
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-nunito"
                style={{ background: "#C084FC33", color: "#7C3AED" }}>📁 Файл</span>
            </div>
          </div>
        )}
      </div>

      {/* Prompt area */}
      {uploaded && !processing && (
        <div className="flex flex-col gap-3 animate-slide-up">
          <label className="font-black font-nunito text-sm text-foreground">
            🎬 Что должна делать анимация?
          </label>
          <div className="flex gap-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Например: дракон летит и дышит огнём..."
              className="flex-1 rounded-2xl border-2 border-border p-3 text-sm font-nunito resize-none focus:outline-none focus:border-primary"
              rows={3}
              style={{ background: "white" }}
            />
            <button
              onClick={handleVoicePrompt}
              className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl self-end transition-all ${
                isRecordingPrompt ? "animate-recording" : ""
              }`}
              style={{
                background: isRecordingPrompt
                  ? "linear-gradient(135deg, #ef4444, #dc2626)"
                  : "linear-gradient(135deg, #FF6B9D, #C084FC)",
              }}
            >
              {isRecordingPrompt ? "⏹" : "🎤"}
            </button>
          </div>
          <p className="text-xs text-muted-foreground font-nunito">
            👆 Нажми на микрофон, если не умеешь писать — говори!
          </p>

          {/* Style chips */}
          <div className="flex flex-wrap gap-2">
            {["🌊 Водный", "🔥 Огненный", "✨ Магический", "🌈 Радужный", "🎵 Музыкальный"].map((s) => (
              <button
                key={s}
                className="px-3 py-1.5 rounded-xl text-xs font-bold font-nunito"
                style={{ background: "hsl(var(--muted))", color: "hsl(var(--foreground))" }}
                onClick={() => setPrompt((p) => (p + " " + s.split(" ")[1].toLowerCase()).trim())}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={handleAnimate}
            disabled={!prompt.trim()}
            className="w-full py-4 rounded-2xl font-black text-lg font-nunito transition-all disabled:opacity-40"
            style={{
              background: prompt.trim()
                ? "linear-gradient(135deg, #FFD93D, #FF6B9D)"
                : "hsl(var(--muted))",
              color: prompt.trim() ? "white" : "hsl(var(--muted-foreground))",
              boxShadow: prompt.trim() ? "0 6px 24px rgba(255, 107, 157, 0.4)" : "none",
            }}
          >
            ✨ Оживить рисунок!
          </button>
        </div>
      )}

      {processing && (
        <div className="flex flex-col items-center gap-4 py-6 animate-slide-up">
          <div className="text-5xl animate-star-spin">⭐</div>
          <div className="text-center">
            <p className="font-black font-nunito text-lg">Создаю магию...</p>
            <p className="text-sm text-muted-foreground font-nunito">Нейросеть оживляет твой рисунок</p>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))", height: 12 }}>
            <div
              className="h-full rounded-full shimmer"
              style={{ background: "linear-gradient(90deg, #FFD93D, #FF6B9D, #C084FC)", width: "70%" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ======== GALLERY TAB ========
function GalleryTab() {
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
function VoiceTab() {
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

// ======== HELPER TAB ========
function HelperTab() {
  const [step, setStep] = useState(-1);
  const tips = [
    { emoji: "📸", title: "Загрузи рисунок", desc: "Сфотографируй или загрузи картинку с телефона или планшета!" },
    { emoji: "🎬", title: "Опиши анимацию", desc: "Скажи голосом или напиши, что должен делать персонаж — летать, прыгать, петь?" },
    { emoji: "✨", title: "Нажми «Оживить»", desc: "Нейросеть сделает всё сама! Подожди немного — и рисунок ожи­вёт!" },
    { emoji: "🎤", title: "Добавь голос", desc: "Запиши свой голос или выбери AI-голос. Пусть персонаж говорит!" },
    { emoji: "💾", title: "Сохрани и поделись", desc: "Сохраняй все работы в галерее и показывай друзьям и родителям!" },
  ];

  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      <div className="flex flex-col items-center gap-4 py-4">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-5xl animate-float"
          style={{ background: "linear-gradient(135deg, #FFD93D, #FF6B9D)", boxShadow: "0 8px 32px rgba(255,107,157,0.4)" }}
        >
          😊
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black font-nunito">Привет, я Лучик!</h2>
          <p className="text-muted-foreground font-nunito text-sm mt-1">Я научу тебя создавать живые рисунки!</p>
        </div>
      </div>

      <div>
        <h3 className="font-black font-nunito text-sm mb-3 text-foreground">📚 Как пользоваться?</h3>
        <div className="flex flex-col gap-3">
          {tips.map((t, i) => (
            <button
              key={i}
              onClick={() => setStep(step === i ? -1 : i)}
              className="fun-card rounded-2xl overflow-hidden text-left"
            >
              <div className="flex items-center gap-3 p-4 bg-white">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `hsl(${i * 60 + 30}, 80%, 90%)` }}
                >
                  {t.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold font-nunito text-sm">{i + 1}. {t.title}</p>
                    <Icon name={step === i ? "ChevronUp" : "ChevronDown"} size={16} className="text-muted-foreground" />
                  </div>
                  {step === i && (
                    <p className="text-xs text-muted-foreground font-nunito mt-1 animate-slide-down">{t.desc}</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-4 border-2" style={{ borderColor: "#FFD93D55", background: "#FFD93D11" }}>
        <p className="font-black font-nunito text-sm mb-3" style={{ color: "#B45309" }}>💡 Идеи для анимации</p>
        <div className="flex flex-wrap gap-2">
          {["Летит по небу", "Танцует", "Дышит огнём", "Плавает в море", "Волшебно сверкает", "Прыгает и смеётся"].map((idea) => (
            <span
              key={idea}
              className="px-3 py-1.5 rounded-xl text-xs font-bold font-nunito"
              style={{ background: "#FFD93D44", color: "#92400E" }}
            >
              {idea}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ======== PROFILE TAB ========
function ProfileTab() {
  const [plan, setPlan] = useState<"free" | "monthly" | "yearly" | "lifetime">("free");

  const plans = [
    {
      id: "monthly", title: "Месячная", price: "199 ₽", period: "в месяц", color: "#38BDF8", emoji: "🌟",
      features: ["10 анимаций/мес", "Базовые голоса", "Галерея 50 работ"],
    },
    {
      id: "yearly", title: "Годовая", price: "1490 ₽", period: "в год", color: "#FF6B9D", emoji: "🚀", badge: "Выгода 37%",
      features: ["Безлимит анимаций", "Все AI-голоса", "Галерея без ограничений", "Музыка и звуки"],
    },
    {
      id: "lifetime", title: "Навсегда", price: "3990 ₽", period: "один раз", color: "#FFD93D", emoji: "👑", badge: "Лучший выбор!",
      features: ["Всё навсегда", "Приоритет поддержки", "Ранний доступ", "Семейный доступ"],
    },
  ];

  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      <div
        className="rounded-3xl p-5 flex items-center gap-4"
        style={{ background: "linear-gradient(135deg, #FFD93D, #FF6B9D)", color: "white" }}
      >
        <div className="w-16 h-16 rounded-full bg-white bg-opacity-30 flex items-center justify-center text-4xl">🧒</div>
        <div>
          <p className="font-black font-nunito text-xl">Маша</p>
          <p className="font-nunito text-sm opacity-90">Создано рисунков: 6</p>
          <div className="mt-1 px-2 py-0.5 rounded-lg inline-block" style={{ background: "rgba(255,255,255,0.3)" }}>
            <span className="text-xs font-bold font-nunito">
              {plan === "free" ? "Бесплатный тариф" : "Премиум ✨"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { emoji: "🎨", value: "6", label: "Рисунков" },
          { emoji: "✨", value: "3", label: "Анимаций" },
          { emoji: "🎤", value: "2", label: "Озвучек" },
        ].map((s) => (
          <div key={s.label} className="fun-card bg-white rounded-2xl p-3 flex flex-col items-center gap-1">
            <span className="text-2xl">{s.emoji}</span>
            <span className="font-black font-nunito text-xl text-foreground">{s.value}</span>
            <span className="text-xs text-muted-foreground font-nunito">{s.label}</span>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-black font-nunito text-sm mb-3 text-foreground">💎 Выбери план</h3>
        <div className="flex flex-col gap-3">
          {plans.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlan(p.id as typeof plan)}
              className="fun-card rounded-2xl overflow-hidden text-left transition-all"
              style={{ border: plan === p.id ? `3px solid ${p.color}` : "3px solid transparent" }}
            >
              <div className="bg-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{p.emoji}</span>
                    <span className="font-black font-nunito">{p.title}</span>
                    {p.badge && (
                      <span className="px-2 py-0.5 rounded-lg text-xs font-bold font-nunito text-white"
                        style={{ background: p.color }}>
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-black font-nunito text-lg" style={{ color: p.color }}>{p.price}</p>
                    <p className="text-xs text-muted-foreground font-nunito">{p.period}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.features.map((f) => (
                    <span key={f} className="text-xs font-nunito text-muted-foreground">• {f}</span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        {plan !== "free" && (
          <button
            className="w-full mt-3 py-4 rounded-2xl font-black text-lg font-nunito text-white"
            style={{
              background: "linear-gradient(135deg, #FFD93D, #FF6B9D)",
              boxShadow: "0 6px 24px rgba(255,107,157,0.4)",
            }}
          >
            🎉 Оформить подписку!
          </button>
        )}
      </div>
    </div>
  );
}

// ======== SETTINGS TAB ========
function SettingsTab() {
  const [pin, setPin] = useState(false);
  const [timeLimit, setTimeLimit] = useState(30);
  const [ageGroup, setAgeGroup] = useState<"4-6" | "7-10">("4-6");
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      <div
        className="rounded-3xl p-5 flex items-center gap-4"
        style={{ background: "linear-gradient(135deg, #34D399, #38BDF8)", color: "white" }}
      >
        <div className="w-14 h-14 rounded-full bg-white bg-opacity-30 flex items-center justify-center text-3xl">🔒</div>
        <div>
          <p className="font-black font-nunito text-lg">Родительский контроль</p>
          <p className="text-sm opacity-90 font-nunito">Безопасная среда для ребёнка</p>
        </div>
      </div>

      <div>
        <label className="font-black font-nunito text-sm text-foreground mb-2 block">👦 Возраст ребёнка</label>
        <div className="flex gap-3">
          {[
            { id: "4-6", label: "4–6 лет", desc: "Голосовой ввод, крупные кнопки" },
            { id: "7-10", label: "7–10 лет", desc: "Текстовый ввод, больше функций" },
          ].map((g) => (
            <button
              key={g.id}
              onClick={() => setAgeGroup(g.id as typeof ageGroup)}
              className="flex-1 rounded-2xl p-3 text-left transition-all"
              style={{
                border: ageGroup === g.id ? "3px solid #34D399" : "3px solid hsl(var(--border))",
                background: ageGroup === g.id ? "#34D39911" : "white",
              }}
            >
              <p className="font-bold font-nunito text-sm">{g.label}</p>
              <p className="text-xs text-muted-foreground font-nunito mt-0.5">{g.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="font-black font-nunito text-sm text-foreground">⏱ Лимит времени</label>
          <span className="font-bold font-nunito text-sm" style={{ color: "#38BDF8" }}>{timeLimit} мин/день</span>
        </div>
        <input
          type="range" min={15} max={120} step={15} value={timeLimit}
          onChange={(e) => setTimeLimit(Number(e.target.value))}
          className="w-full accent-sky-400"
        />
        <div className="flex justify-between text-xs text-muted-foreground font-nunito mt-1">
          <span>15 мин</span><span>120 мин</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {[
          { label: "🔐 PIN-код для настроек", desc: "Ребёнок не сможет менять настройки", value: pin, setter: setPin },
          { label: "🔔 Уведомления для родителей", desc: "Получай отчёт об активности", value: notifications, setter: setNotifications },
        ].map((t) => (
          <div key={t.label} className="fun-card bg-white rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="font-bold font-nunito text-sm">{t.label}</p>
              <p className="text-xs text-muted-foreground font-nunito">{t.desc}</p>
            </div>
            <button
              onClick={() => t.setter(!t.value)}
              className="w-12 h-6 rounded-full transition-all relative flex-shrink-0"
              style={{ background: t.value ? "#34D399" : "hsl(var(--muted))" }}
            >
              <div
                className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all"
                style={{ left: t.value ? "calc(100% - 22px)" : "2px", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-4 border-2" style={{ borderColor: "#34D39955", background: "#34D39911" }}>
        <p className="font-black font-nunito text-sm mb-2" style={{ color: "#059669" }}>✅ Безопасный контент</p>
        <div className="flex flex-col gap-1">
          {[
            "Только безопасный контент для детей",
            "Никакой рекламы внутри приложения",
            "Данные хранятся защищённо",
            "Без выхода в интернет без одобрения",
          ].map((f) => (
            <p key={f} className="text-xs font-nunito text-muted-foreground">✓ {f}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

// ======== MAIN APP ========
export default function Index() {
  const [tab, setTab] = useState<Tab>("editor");
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (confetti) {
      const t = setTimeout(() => setConfetti(false), 2500);
      return () => clearTimeout(t);
    }
  }, [confetti]);

  const renderTab = () => {
    switch (tab) {
      case "editor": return <EditorTab onAnimate={() => setConfetti(true)} />;
      case "gallery": return <GalleryTab />;
      case "voice": return <VoiceTab />;
      case "helper": return <HelperTab />;
      case "profile": return <ProfileTab />;
      case "settings": return <SettingsTab />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen font-nunito" style={{ background: "linear-gradient(160deg, #FFF9E6 0%, #FFF0F5 50%, #F0FFFE 100%)" }}>
      <Confetti active={confetti} />

      {/* Decorative blobs */}
      <div
        className="blob-decoration fixed w-64 h-64 opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #FFD93D, #FF6B9D)", top: -80, right: -80, zIndex: 0 }}
      />
      <div
        className="blob-decoration fixed w-48 h-48 opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #C084FC, #38BDF8)", bottom: 80, left: -40, zIndex: 0, animationDelay: "4s" }}
      />

      {/* Header */}
      <header
        className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between"
        style={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(16px)",
          borderBottom: "2px solid hsl(var(--border))",
          boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xl animate-glow"
            style={{ background: "linear-gradient(135deg, #FFD93D, #FF6B9D)" }}
          >
            🌟
          </div>
          <div>
            <p className="font-black font-nunito text-base leading-tight text-foreground">ЖиваяКартинка</p>
            <p className="text-[10px] text-muted-foreground font-nunito leading-tight">оживи свой рисунок!</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl flex items-center gap-1" style={{ background: "#FFD93D22" }}>
            <span className="text-sm">⭐</span>
            <span className="text-xs font-bold font-nunito" style={{ color: "#B45309" }}>42 звезды</span>
          </div>
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: "hsl(var(--muted))" }}
          >
            🧒
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 pt-4 pb-28 relative z-10">
        <div key={tab} className="animate-fade-in">
          {renderTab()}
        </div>
      </main>

      <BottomNav active={tab} onSelect={setTab} />
    </div>
  );
}
