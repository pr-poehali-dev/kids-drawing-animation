import { useState, useEffect } from "react";
import { Tab } from "@/components/app/types";
import { Confetti, BottomNav } from "@/components/app/Mascot";
import { EditorTab } from "@/components/app/EditorTab";
import { GalleryTab, VoiceTab } from "@/components/app/GalleryVoiceTab";
import { HelperTab, ProfileTab, SettingsTab } from "@/components/app/HelperProfileSettingsTab";

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
