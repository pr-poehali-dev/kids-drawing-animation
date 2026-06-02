import { useState } from "react";
import Icon from "@/components/ui/icon";

const MASCOT_URL = "https://cdn.poehali.dev/projects/cdc098af-7bf4-43b8-96fe-edf47bcc8c0e/bucket/7e2ea9d3-0128-4926-a770-d981d61ee634.jpeg";

// ======== HELPER TAB ========
export function HelperTab() {
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
          className="relative animate-float"
          style={{ filter: "drop-shadow(0 8px 24px rgba(255,107,157,0.45))" }}
        >
          <div
            className="w-32 h-32 rounded-full overflow-hidden"
            style={{ border: "3px solid #FFD93D" }}
          >
            <img
              src={MASCOT_URL}
              alt="Лучик"
              className="w-full h-full object-cover object-top"
              style={{ transform: "scale(1.2) translateY(6px)" }}
            />
          </div>
          <span className="absolute -bottom-1 -right-1 text-2xl">✨</span>
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
export function ProfileTab() {
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
                    {"badge" in p && p.badge && (
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
export function SettingsTab() {
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