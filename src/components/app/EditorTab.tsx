import { useState, useRef } from "react";
import { Mascot } from "./Mascot";

export function EditorTab({ onAnimate }: { onAnimate: () => void }) {
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
