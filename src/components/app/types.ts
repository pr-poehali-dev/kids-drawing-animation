export type Tab = "editor" | "gallery" | "voice" | "helper" | "profile" | "settings";

export interface Drawing {
  id: string;
  name: string;
  date: string;
  emoji: string;
  color: string;
  hasAnimation: boolean;
  hasVoice: boolean;
}

export const MOCK_DRAWINGS: Drawing[] = [
  { id: "1", name: "Дракончик Пыша", date: "28 мая", emoji: "🐉", color: "#FFD93D", hasAnimation: true, hasVoice: true },
  { id: "2", name: "Принцесса Звёздочка", date: "25 мая", emoji: "👸", color: "#FF6B9D", hasAnimation: true, hasVoice: false },
  { id: "3", name: "Кот-волшебник", date: "20 мая", emoji: "🐱", color: "#C084FC", hasAnimation: false, hasVoice: false },
  { id: "4", name: "Радужный замок", date: "15 мая", emoji: "🏰", color: "#38BDF8", hasAnimation: false, hasVoice: false },
  { id: "5", name: "Весёлый робот", date: "10 мая", emoji: "🤖", color: "#34D399", hasAnimation: true, hasVoice: true },
  { id: "6", name: "Летающий кит", date: "5 мая", emoji: "🐋", color: "#FB923C", hasAnimation: false, hasVoice: false },
];
