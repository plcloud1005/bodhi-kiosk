"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Landmark, User, HeartHandshake, Flame, HandHeart } from "lucide-react";

const buttons = [
  {
    id: "activities",
    zh: "今日活动",
    en: "Today's Activities",
    href: "/activities",
    icon: <CalendarDays size={40} strokeWidth={1.5} />,
  },
  {
    id: "about",
    zh: "禅堂介绍",
    en: "About Us",
    href: "/about",
    icon: <Landmark size={40} strokeWidth={1.5} />,
  },
  {
    id: "classes",
    zh: "课程报名",
    en: "Classes",
    href: "/classes",
    icon: <User size={40} strokeWidth={1.5} />,
  },
  {
    id: "consultation",
    zh: "咨询与加持",
    en: "Consultation",
    href: "/consultation",
    icon: <HeartHandshake size={36} strokeWidth={1.5} />,
  },
  {
    id: "offering",
    zh: "点灯供养",
    en: "Light Offering",
    href: "/offering",
    icon: <Flame size={36} strokeWidth={1.5} />,
  },
  {
    id: "blessings",
    zh: "祈福与回向",
    en: "Blessings",
    href: "/blessings",
    icon: <HandHeart size={36} strokeWidth={1.5} />,
  },
];

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState<"zh" | "en">("zh");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => router.refresh(), 60000);
    };
    reset();
    window.addEventListener("touchstart", reset);
    window.addEventListener("mousemove", reset);
    window.addEventListener("click", reset);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("touchstart", reset);
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("click", reset);
    };
  }, [router]);

  return (
    <main
      style={{ backgroundColor: "#F5F0E8", minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <header
        style={{
          backgroundColor: "#F5F0E8",
          borderBottom: "1px solid #D4C5A9",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#2C1810", margin: 0 }}>
            {lang === "zh" ? "菩提禅修 · 旧金山" : "Bodhi Meditation · San Francisco"}
          </h1>
          <p style={{ fontSize: 14, color: "#6B4C35", margin: 0 }}>
            {lang === "zh" ? "Bodhi Meditation San Francisco" : "欢迎来到菩提禅堂"}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            border: "1.5px solid #B8934A",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => setLang("zh")}
            style={{
              padding: "8px 20px",
              fontSize: 15,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              backgroundColor: lang === "zh" ? "#B8934A" : "transparent",
              color: lang === "zh" ? "#fff" : "#B8934A",
              transition: "all 0.2s",
            }}
          >
            中文
          </button>
          <button
            onClick={() => setLang("en")}
            style={{
              padding: "8px 20px",
              fontSize: 15,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              backgroundColor: lang === "en" ? "#B8934A" : "transparent",
              color: lang === "en" ? "#fff" : "#B8934A",
              transition: "all 0.2s",
            }}
          >
            EN
          </button>
        </div>
      </header>

      <div style={{ textAlign: "center", padding: "24px 32px 8px" }}>
        <p style={{ fontSize: 18, color: "#6B4C35", margin: 0 }}>
          {lang === "zh"
            ? "请点击屏幕了解今日活动、课程信息、祈福与更多服务"
            : "Please touch the screen to learn about our activities, classes, blessing services and more."}
        </p>
      </div>

      <section
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          padding: "20px 32px 24px",
        }}
      >
        {buttons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => router.push(btn.href)}
            style={{
              backgroundColor: "#EDE5D8",
              border: "1.5px solid #D4C5A9",
              borderRadius: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              padding: "32px 16px",
              cursor: "pointer",
              transition: "all 0.15s",
              minHeight: 160,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#E0D4C0";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#B8934A";
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#EDE5D8";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#D4C5A9";
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                backgroundColor: "#B8934A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              {btn.icon}
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#2C1810" }}>
                {btn.zh}
              </div>
              <div style={{ fontSize: 14, color: "#6B4C35", marginTop: 4 }}>
                {btn.en}
              </div>
            </div>
          </button>
        ))}
      </section>

      <footer
        style={{
          backgroundColor: "#2C1810",
          color: "#F5F0E8",
          textAlign: "center",
          padding: "14px 32px",
          fontSize: 15,
        }}
      >
        {lang === "zh"
          ? "如需帮助，请找前台义工 · For assistance, please contact our volunteers."
          : "For assistance, please contact our volunteers · 如需帮助，请找前台义工"}
      </footer>
    </main>
  );
}