"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home as HomeIcon, Landmark } from "lucide-react";

interface Activity {
  id: number;
  startTime: string;
  endTime: string;
  titleZh: string;
  titleEn: string;
  locationZh: string;
  locationEn: string;
}

const sampleActivities: Activity[] = [
  {
    id: 1,
    startTime: "10:00",
    endTime: "11:30",
    titleZh: "禅修体验课(中文)",
    titleEn: "Meditation Intro (Chinese)",
    locationZh: "二楼禅室",
    locationEn: "2F Meditation Hall",
  },
  {
    id: 2,
    startTime: "14:00",
    endTime: "15:30",
    titleZh: "减压禅修营(英文)",
    titleEn: "Stress Relief Meditation (English)",
    locationZh: "二楼禅室",
    locationEn: "2F Meditation Hall",
  },
  {
    id: 3,
    startTime: "19:00",
    endTime: "20:30",
    titleZh: "念佛共修",
    titleEn: "Buddha Recitation",
    locationZh: "大殿",
    locationEn: "Main Hall",
  },
  {
    id: 4,
    startTime: "20:45",
    endTime: "21:15",
    titleZh: "能量加持",
    titleEn: "Energy Blessing",
    locationZh: "大殿",
    locationEn: "Main Hall",
  },
];

function getTodayString(lang: "zh" | "en") {
  const now = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const daysZh = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  if (lang === "zh") {
    return `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 ${daysZh[now.getDay()]}`;
  }
  return `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()} ${days[now.getDay()]}`;
}

export default function ActivitiesPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const [activities, setActivities] = useState<Activity[]>(sampleActivities);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activities")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setActivities(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    const interval = setInterval(() => {
      fetch("/api/activities")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setActivities(data);
        })
        .catch(() => {});
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => router.push("/"), 60000);
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
    <main style={{ backgroundColor: "#F5F0E8", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{
        backgroundColor: "#F5F0E8",
        borderBottom: "1px solid #D4C5A9",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <button
          onClick={() => router.push("/")}
          style={{
            backgroundColor: "#EDE5D8",
            border: "1.5px solid #D4C5A9",
            borderRadius: 8,
            padding: "8px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
            color: "#2C1810",
          }}
        >
          <HomeIcon size={18} strokeWidth={2} />
          {lang === "zh" ? "首页" : "Home"}
        </button>

        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#2C1810", margin: 0 }}>
            {lang === "zh" ? "今日活动" : "Today's Activities"}
          </h1>
          <p style={{ fontSize: 13, color: "#6B4C35", margin: 0 }}>
            {getTodayString(lang)}
          </p>
        </div>

        <div style={{ display: "flex", border: "1.5px solid #B8934A", borderRadius: 8, overflow: "hidden" }}>
          <button
            onClick={() => setLang("zh")}
            style={{
              padding: "6px 16px", fontSize: 14, fontWeight: 600,
              border: "none", cursor: "pointer",
              backgroundColor: lang === "zh" ? "#B8934A" : "transparent",
              color: lang === "zh" ? "#fff" : "#B8934A",
            }}
          >中文</button>
          <button
            onClick={() => setLang("en")}
            style={{
              padding: "6px 16px", fontSize: 14, fontWeight: 600,
              border: "none", cursor: "pointer",
              backgroundColor: lang === "en" ? "#B8934A" : "transparent",
              color: lang === "en" ? "#fff" : "#B8934A",
            }}
          >EN</button>
        </div>
      </header>

      <div style={{ flex: 1, display: "flex", gap: 24, padding: "24px 32px" }}>
        <div style={{
          width: 280,
          flexShrink: 0,
          borderRadius: 16,
          backgroundColor: "#2C1810",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          minHeight: 400,
        }}>
          <div style={{ textAlign: "center", color: "#B8934A" }}>
            <Landmark size={80} strokeWidth={1} />
            <p style={{ fontSize: 14, marginTop: 12, fontWeight: 600 }}>
              菩提禅堂
            </p>
            <p style={{ fontSize: 12, marginTop: 2, opacity: 0.8 }}>
              Bodhi Meditation
            </p>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: "#6B4C35" }}>
              {lang === "zh" ? "加载中..." : "Loading..."}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  style={{
                    backgroundColor: "#EDE5D8",
                    border: "1.5px solid #D4C5A9",
                    borderRadius: 12,
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <div style={{
                    backgroundColor: "#B8934A",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "8px 14px",
                    textAlign: "center",
                    flexShrink: 0,
                    minWidth: 110,
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{activity.startTime}</div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>— {activity.endTime}</div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#2C1810" }}>
                      {lang === "zh" ? activity.titleZh : activity.titleEn}
                    </div>
                    <div style={{ fontSize: 13, color: "#6B4C35", marginTop: 2 }}>
                      {lang === "zh" ? activity.titleEn : activity.titleZh}
                    </div>
                  </div>

                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#2C1810" }}>
                      {lang === "zh" ? activity.locationZh : activity.locationEn}
                    </div>
                    <div style={{ fontSize: 12, color: "#6B4C35" }}>
                      {lang === "zh" ? activity.locationEn : activity.locationZh}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer style={{
        backgroundColor: "#2C1810",
        color: "#F5F0E8",
        textAlign: "center",
        padding: "14px 32px",
        fontSize: 15,
      }}>
        {lang === "zh"
          ? "如需帮助，请找前台义工 · For assistance, please contact our volunteers."
          : "For assistance, please contact our volunteers · 如需帮助，请找前台义工"}
      </footer>
    </main>
  );
}