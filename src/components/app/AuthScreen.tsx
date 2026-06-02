import { useState } from "react";

const AUTH_URL = "https://functions.poehali.dev/41206671-d349-4cf5-b4b0-d5183af25981";

const MASCOT_URL =
  "https://cdn.poehali.dev/projects/cdc098af-7bf4-43b8-96fe-edf47bcc8c0e/bucket/7e2ea9d3-0128-4926-a770-d981d61ee634.jpeg";

export interface AuthUser {
  id: string;
  login: string;
  login_type: "phone" | "email";
  name: string | null;
}

interface Props {
  onAuth: (user: AuthUser, token: string) => void;
}

type Step = "input" | "code" | "name";

export default function AuthScreen({ onAuth }: Props) {
  const [step, setStep] = useState<Step>("input");
  const [login, setLogin] = useState("");
  const [loginType, setLoginType] = useState<"phone" | "email">("phone");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [codeHint, setCodeHint] = useState(""); // dev only

  const handleSendCode = async () => {
    if (!login.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${AUTH_URL}?action=send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: login.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка отправки");
      setLoginType(data.login_type);
      setCodeHint(data.code_hint || "");
      setStep("code");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (code.length < 4) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${AUTH_URL}?action=verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: login.trim(), code, name: name.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Неверный код");
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      onAuth(data.user, data.token);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  const placeholder = loginType === "phone" ? "+7 999 123-45-67" : "example@mail.ru";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 font-nunito"
      style={{ background: "linear-gradient(160deg, #FFF9E6 0%, #FFF0F5 50%, #F0FFFE 100%)" }}
    >
      {/* Background image */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url(https://cdn.poehali.dev/projects/cdc098af-7bf4-43b8-96fe-edf47bcc8c0e/bucket/4e891512-4342-478b-b9bd-6d2270f4d43c.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          opacity: 0.13,
          zIndex: 0,
        }}
      />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-6">
        {/* Mascot */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-28 h-28 rounded-full overflow-hidden animate-float"
            style={{ border: "3px solid #FFD93D", boxShadow: "0 8px 32px rgba(255,107,157,0.4)" }}
          >
            <img
              src={MASCOT_URL}
              alt="Лучик"
              className="w-full h-full object-cover object-top"
              style={{ transform: "scale(1.2) translateY(6px)" }}
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-foreground">ЖиваяКартинка</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {step === "input" && "Привет! Войди или создай аккаунт 🌟"}
              {step === "code" && `Код отправлен на ${login} 📬`}
              {step === "name" && "Как тебя зовут? 😊"}
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="w-full bg-white rounded-3xl p-6 shadow-lg" style={{ border: "2px solid #FFD93D33" }}>

          {/* STEP: input login */}
          {step === "input" && (
            <div className="flex flex-col gap-4">
              {/* Toggle phone/email */}
              <div className="flex rounded-2xl p-1 gap-1" style={{ background: "hsl(var(--muted))" }}>
                {(["phone", "email"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setLoginType(t); setLogin(""); setError(""); }}
                    className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
                    style={
                      loginType === t
                        ? { background: "white", color: "hsl(var(--foreground))", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }
                        : { color: "hsl(var(--muted-foreground))" }
                    }
                  >
                    {t === "phone" ? "📱 Телефон" : "✉️ Email"}
                  </button>
                ))}
              </div>

              <input
                type={loginType === "phone" ? "tel" : "email"}
                value={login}
                onChange={(e) => { setLogin(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                placeholder={placeholder}
                className="w-full rounded-2xl border-2 border-border px-4 py-3 text-base font-nunito focus:outline-none focus:border-primary"
                autoFocus
              />

              {error && <p className="text-sm text-red-500 font-bold">{error}</p>}

              <button
                onClick={handleSendCode}
                disabled={!login.trim() || loading}
                className="w-full py-4 rounded-2xl font-black text-lg text-white transition-all disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #FFD93D, #FF6B9D)", boxShadow: "0 6px 20px rgba(255,107,157,0.4)" }}
              >
                {loading ? "Отправляем..." : "Получить код ✨"}
              </button>
            </div>
          )}

          {/* STEP: enter OTP code */}
          {step === "code" && (
            <div className="flex flex-col gap-4">
              <div className="text-center py-2">
                <p className="font-bold text-sm text-muted-foreground">
                  Введи 6-значный код
                </p>
                {codeHint && (
                  <p className="text-xs mt-1 px-3 py-1 rounded-lg inline-block font-bold"
                    style={{ background: "#FFD93D33", color: "#B45309" }}>
                    🔑 Код для теста: {codeHint}
                  </p>
                )}
              </div>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                placeholder="000000"
                className="w-full rounded-2xl border-2 border-border px-4 py-4 text-3xl font-black text-center tracking-widest font-nunito focus:outline-none focus:border-primary"
                autoFocus
              />

              {error && <p className="text-sm text-red-500 font-bold text-center">{error}</p>}

              <button
                onClick={handleVerify}
                disabled={code.length < 6 || loading}
                className="w-full py-4 rounded-2xl font-black text-lg text-white transition-all disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #34D399, #38BDF8)", boxShadow: "0 6px 20px rgba(52,211,153,0.4)" }}
              >
                {loading ? "Проверяем..." : "Войти 🚀"}
              </button>

              <button
                onClick={() => { setStep("input"); setCode(""); setError(""); }}
                className="text-sm text-muted-foreground font-bold text-center w-full"
              >
                ← Изменить {loginType === "phone" ? "телефон" : "email"}
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center px-4">
          Входя в приложение, ты соглашаешься с условиями использования
        </p>
      </div>
    </div>
  );
}
