import { useState, useEffect } from "react";
import { Tab } from "@/components/app/types";
import { Confetti, BottomNav } from "@/components/app/Mascot";
import { EditorTab } from "@/components/app/EditorTab";
import { GalleryTab, VoiceTab } from "@/components/app/GalleryVoiceTab";
import { HelperTab, ProfileTab, SettingsTab } from "@/components/app/HelperProfileSettingsTab";
import { AuthUser } from "@/components/app/AuthScreen";

interface IndexProps {
  user: AuthUser;
  onLogout: () => void;
}

export default function Index({ user, onLogout }: IndexProps) {
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

      {/* Background image */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(https://cdn.poehali.dev/projects/cdc098af-7bf4-43b8-96fe-edf47bcc8c0e/bucket/4e891512-4342-478b-b9bd-6d2270f4d43c.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
          opacity: 0.18,
          zIndex: 0,
        }}
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
            onClick={onLogout}
            title="Выйти"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold font-nunito"
            style={{ background: "hsl(var(--muted))", color: "hsl(var(--foreground))" }}
          >
            {user.name ? user.name[0].toUpperCase() : "👤"}
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