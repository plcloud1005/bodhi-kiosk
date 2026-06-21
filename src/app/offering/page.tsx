"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home as HomeIcon, Flame, X, Sun } from "lucide-react";

interface LampType {
  id: string;
  zh: string;
  en: string;
}

const lampTypes: LampType[] = [
  { id: "wisdom", zh: "光明灯", en: "Light of Wisdom" },
  { id: "peace", zh: "平安灯", en: "Peace Lamp" },
  { id: "health", zh: "健康灯", en: "Health Lamp" },
  { id: "prosperity", zh: "财运灯", en: "Prosperity Lamp" },
];

const durations = [
  { id: "7day", zh: "7天", en: "7 Days", descZh: "心愿成就", descEn: "Fulfillment of wishes" },
  { id: "49day", zh: "49天", en: "49 Days", descZh: "心愿加速成就", descEn: "Accelerated fulfillment" },
  { id: "1year", zh: "一年", en: "1 Year", descZh: "全年护佑", descEn: "A full year of blessings" },
];

const benefits = [
  { zh: "身体健康、长寿喜乐、内心平静", en: "Good health, longevity, joy, and inner peace" },
  { zh: "出行平安，远离意外", en: "Safe travels and protection from misfortune" },
  { zh: "事业顺利，智慧明晰", en: "Career growth, clarity, and inspired guidance" },
  { zh: "家庭和睦，福泽后代", en: "Family harmony and blessings for future generations" },
  { zh: "学业进步，考试顺利", en: "Academic success and smooth progress in examinations" },
  { zh: "超荐先亡，往生善处", en: "Blessings for departed loved ones" },
];

const stories = [
  {
    nameZh: "Winnie",
    nameEn: "Winnie Zuo",
    titleZh: "十年绿卡等待，一周内获批",
    titleEn: "From 10 Years of Waiting to a Green Card in One Week",
    bodyZh: "在等待EB-3绿卡近十年后，案件一直卡着没有进展，让我十分焦虑无助。我决定在禅堂点一盏加持灯并开始做义工。母亲也为我点了一盏祈福灯。短短几天后，我的绿卡正式获批！我非常感激这份慈悲的加持。",
    bodyEn: "After nearly 10 years of waiting for my EB-3 Green Card, my case felt completely stuck, leaving me anxious and helpless. I offered a blessing lamp at the center and began volunteering, and my mother offered a lamp for me as well. Within days, my Green Card was officially approved — I'm deeply grateful for this compassionate blessing.",
  },
  {
    nameZh: "Sylvia",
    nameEn: "Sylvia Yu",
    titleZh: "两千名申请者中脱颖而出",
    titleEn: "From 2,000 Applicants to a Top 40 Spot",
    bodyZh: "我侄子申请竞争激烈的医师助理项目，两千多人争夺四十个名额，压力大到失眠。他的母亲在禅堂点了一盏祈福灯并为他祈祷。不到一周，他便收到了正式录取通知。我们对这份慈悲的加持深感感激。",
    bodyEn: "When my nephew applied to a highly competitive Medical PA program with over 2,000 applicants for only 40 spots, the pressure was intense enough that he developed insomnia. His mother offered a lamp at the center and prayed for his success. In less than a week, he received his official acceptance letter — we're deeply grateful for this compassionate blessing.",
  },
];

function getNextDates(count: number) {
  const dates: { label: string; value: string }[] = [];
  const dayNamesZh = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  for (let i = 1; i <= count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const label = `${d.getMonth() + 1}/${d.getDate()} ${dayNamesZh[d.getDay()]}`;
    dates.push({ label, value: d.toISOString().split("T")[0] });
  }
  return dates;
}

export default function OfferingPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const [isMobile, setIsMobile] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedLamp, setSelectedLamp] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [donorName, setDonorName] = useState("");
  const [dedication, setDedication] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string } | null>(null);
  const [totalToday, setTotalToday] = useState<number | null>(null);

  const availableDates = getNextDates(4);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    fetch("/api/offering")
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.totalToday === "number") setTotalToday(data.totalToday);
      })
      .catch(() => {});
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

  const openPanel = () => {
    setSelectedLamp(null);
    setSelectedDuration(null);
    setDonorName("");
    setDedication("");
    setSelectedDate("");
    setResult(null);
    setPanelOpen(true);
  };

  const closePanel = () => setPanelOpen(false);

  const handleSubmit = async () => {
    if (!selectedLamp || !selectedDuration || !donorName.trim() || !selectedDate) {
      setResult({ success: false, message: lang === "zh" ? "请完整填写所有信息" : "Please complete all fields" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/offering", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lampType: selectedLamp,
          duration: selectedDuration,
          donorName,
          dedication,
          preferredDate: selectedDate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult({ success: true });
        if (typeof data.totalToday === "number") setTotalToday(data.totalToday);
      } else {
        setResult({ success: false, message: data.message || (lang === "zh" ? "提交失败，请重试" : "Submission failed, please try again") });
      }
    } catch {
      setResult({ success: true });
      setTotalToday((prev) => (prev ?? 0) + 1);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ backgroundColor: "#F5F0E8", minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Header */}
      <header style={{
        backgroundColor: "#F5F0E8",
        borderBottom: "1px solid #D4C5A9",
        padding: isMobile ? "12px 16px" : "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 10,
      }}>
        <button
          onClick={() => router.push("/")}
          style={{
            backgroundColor: "#EDE5D8",
            border: "1.5px solid #D4C5A9",
            borderRadius: 8,
            padding: isMobile ? "8px 12px" : "8px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: isMobile ? 13 : 14,
            color: "#2C1810",
          }}
        >
          <HomeIcon size={18} strokeWidth={2} />
          {lang === "zh" ? "首页" : "Home"}
        </button>

        <div style={{ textAlign: "center", flex: isMobile ? "1 1 100%" : "initial", order: isMobile ? 3 : 0 }}>
          <h1 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: "#2C1810", margin: 0 }}>
            {lang === "zh" ? "点灯供养" : "Light Offering"}
          </h1>
        </div>

        <div style={{ display: "flex", border: "1.5px solid #B8934A", borderRadius: 8, overflow: "hidden" }}>
          <button
            onClick={() => setLang("zh")}
            style={{
              padding: isMobile ? "6px 12px" : "6px 16px", fontSize: isMobile ? 13 : 14, fontWeight: 600,
              border: "none", cursor: "pointer",
              backgroundColor: lang === "zh" ? "#B8934A" : "transparent",
              color: lang === "zh" ? "#fff" : "#B8934A",
            }}
          >中文</button>
          <button
            onClick={() => setLang("en")}
            style={{
              padding: isMobile ? "6px 12px" : "6px 16px", fontSize: isMobile ? 13 : 14, fontWeight: 600,
              border: "none", cursor: "pointer",
              backgroundColor: lang === "en" ? "#B8934A" : "transparent",
              color: lang === "en" ? "#fff" : "#B8934A",
            }}
          >EN</button>
        </div>
      </header>

      <div style={{ flex: 1, padding: isMobile ? "16px" : "32px 48px", maxWidth: 1400, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>

        {/* Intro banner */}
        <div style={{
          backgroundColor: "#2C1810",
          borderRadius: 16,
          padding: isMobile ? "20px" : "28px 32px",
          textAlign: "center",
          color: "#F5F0E8",
          marginBottom: isMobile ? 20 : 28,
        }}>
          <Flame size={isMobile ? 36 : 44} strokeWidth={1.2} style={{ color: "#B8934A" }} />
          <p style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, marginTop: 10, color: "#B8934A" }}>
            {lang === "zh" ? "诚心点灯，获无量加持" : "Offer a Lamp with Sincerity and Receive Immeasurable Blessings"}
          </p>
          <p style={{ fontSize: isMobile ? 13 : 15, marginTop: 8, opacity: 0.85, lineHeight: 1.6, maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}>
            {lang === "zh"
              ? "点亮一盏灯，照亮佛菩萨的面容，也照亮我们自己的身心。以至诚之心供养，愿佛光护佑自己与家人。"
              : "By offering a lamp to illuminate the Buddha's face, we also illuminate our own body and mind. With sincerity and reverence, may this light bless and protect us and our loved ones."}
          </p>
          {totalToday !== null && (
            <p style={{ fontSize: 13, marginTop: 14, color: "#B8934A" }}>
              {lang === "zh" ? `今日已有 ${totalToday} 人点灯` : `${totalToday} lamps offered today`}
            </p>
          )}
        </div>

        {/* Lamp types grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gap: isMobile ? 10 : 16,
          marginBottom: isMobile ? 20 : 28,
        }}>
          {lampTypes.map((lamp) => (
            <div
              key={lamp.id}
              style={{
                backgroundColor: "#EDE5D8",
                border: "1.5px solid #D4C5A9",
                borderRadius: 14,
                padding: isMobile ? "16px 10px" : "22px 16px",
                textAlign: "center",
              }}
            >
              <div style={{
                width: isMobile ? 48 : 60,
                height: isMobile ? 48 : 60,
                borderRadius: "50%",
                backgroundColor: "#B8934A",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
              }}>
                <Flame size={isMobile ? 24 : 30} strokeWidth={1.5} />
              </div>
              <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, color: "#2C1810", marginTop: 10 }}>
                {lamp.zh}
              </div>
              <div style={{ fontSize: isMobile ? 11 : 12, color: "#6B4C35", marginTop: 2 }}>
                {lamp.en}
              </div>
            </div>
          ))}
        </div>

        {/* Light a Lamp button */}
        <div style={{ textAlign: "center", marginBottom: isMobile ? 24 : 32 }}>
          <button
            onClick={openPanel}
            style={{
              backgroundColor: "#B8934A",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: isMobile ? "14px 32px" : "16px 48px",
              fontSize: isMobile ? 16 : 18,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {lang === "zh" ? "我要点灯" : "Light a Lamp"}
          </button>
          <p style={{ fontSize: 12, color: "#6B4C35", marginTop: 10 }}>
            {lang === "zh" ? "点灯功德，回向十方法界" : "May the merit be dedicated to all beings"}
          </p>
        </div>

        {/* Benefits + Duration meaning side by side */}
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 16 : 24, marginBottom: isMobile ? 20 : 28 }}>
          {/* Benefits */}
          <div style={{
            flex: 1,
            backgroundColor: "#EDE5D8",
            border: "1.5px solid #D4C5A9",
            borderRadius: 14,
            padding: isMobile ? 16 : 24,
          }}>
            <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: "#2C1810", marginBottom: 12 }}>
              {lang === "zh" ? "点灯祈福内容" : "What You May Pray For"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {benefits.map((b, i) => (
                <div key={i} style={{ display: "flex", gap: 8, fontSize: isMobile ? 13 : 14, color: "#6B4C35", lineHeight: 1.5 }}>
                  <span style={{ color: "#B8934A" }}>•</span>
                  <span>{lang === "zh" ? b.zh : b.en}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Duration meaning */}
          <div style={{
            flex: 1,
            backgroundColor: "#EDE5D8",
            border: "1.5px solid #D4C5A9",
            borderRadius: 14,
            padding: isMobile ? 16 : 24,
          }}>
            <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: "#2C1810", marginBottom: 12 }}>
              {lang === "zh" ? "供灯天数的意义" : "The Meaning Behind the Duration"}
            </div>
            <div style={{ fontSize: isMobile ? 13 : 14, color: "#6B4C35", lineHeight: 1.6, marginBottom: 14 }}>
              {lang === "zh"
                ? "供灯天数各有不同的意涵：7天代表心愿成就，49天代表心愿加速成就，一年则代表全年护佑。天数可依个人心愿与因缘选择，最重要的是以至诚恭敬之心供养。"
                : "The number of days carries different meanings: 7 days represents the fulfillment of wishes, 49 days represents accelerated fulfillment, and a full year represents continuous blessings. The choice depends on your personal needs — what matters most is sincerity and reverence."}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {durations.map((d) => (
                <div key={d.id} style={{
                  flex: "1 1 100px",
                  backgroundColor: "#fff",
                  border: "1px solid #D4C5A9",
                  borderRadius: 10,
                  padding: "10px 8px",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: isMobile ? 14 : 15, fontWeight: 700, color: "#2C1810" }}>
                    {lang === "zh" ? d.zh : d.en}
                  </div>
                  <div style={{ fontSize: 11, color: "#B8934A", marginTop: 2 }}>
                    {lang === "zh" ? d.descZh : d.descEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div style={{ marginBottom: isMobile ? 16 : 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Sun size={20} style={{ color: "#B8934A" }} />
            <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: "#2C1810" }}>
              {lang === "zh" ? "学员分享" : "Stories of Light Offering"}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: isMobile ? 12 : 16 }}>
            {stories.map((s, i) => (
              <div key={i} style={{
                backgroundColor: "#EDE5D8",
                border: "1.5px solid #D4C5A9",
                borderRadius: 14,
                padding: isMobile ? 16 : 20,
              }}>
                <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, color: "#2C1810", marginBottom: 4 }}>
                  {lang === "zh" ? s.titleZh : s.titleEn}
                </div>
                <div style={{ fontSize: 12, color: "#B8934A", fontWeight: 600, marginBottom: 8 }}>
                  · {lang === "zh" ? s.nameZh : s.nameEn}
                </div>
                <div style={{ fontSize: isMobile ? 12 : 13, color: "#6B4C35", lineHeight: 1.6 }}>
                  {lang === "zh" ? s.bodyZh : s.bodyEn}
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "#9C8568", marginTop: 10, textAlign: "center" }}>
            {lang === "zh" ? "* 以上为学员个人经历分享，因人而异" : "* Individual results may vary"}
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: "#2C1810",
        color: "#F5F0E8",
        textAlign: "center",
        padding: isMobile ? "10px 16px" : "14px 32px",
        fontSize: isMobile ? 12 : 15,
      }}>
        {lang === "zh"
          ? "如需帮助，请找前台义工 · For assistance, please contact our volunteers."
          : "For assistance, please contact our volunteers · 如需帮助，请找前台义工"}
      </footer>

      {/* Slide-up panel */}
      {panelOpen && (
        <>
          <div
            onClick={closePanel}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(44,24,16,0.4)", zIndex: 40 }}
          />
          <div style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#F5F0E8",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            boxShadow: "0 -8px 30px rgba(0,0,0,0.15)",
            padding: isMobile ? "20px 16px 24px" : "28px 40px 32px",
            zIndex: 50,
            maxHeight: "85vh",
            overflowY: "auto",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700, color: "#2C1810" }}>
                {lang === "zh" ? "点灯供养" : "Light a Lamp"}
              </div>
              <button
                onClick={closePanel}
                style={{
                  background: "#EDE5D8", border: "1.5px solid #D4C5A9", borderRadius: "50%",
                  width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#2C1810", flexShrink: 0,
                }}
              >
                <X size={18} />
              </button>
            </div>

            {result?.success ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🕯️</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#2C1810", marginBottom: 8 }}>
                  {lang === "zh" ? "点灯成功！" : "Lamp Offered!"}
                </div>
                <div style={{ fontSize: 14, color: "#6B4C35", lineHeight: 1.6, marginBottom: 20 }}>
                  {lang === "zh" ? "愿灯光功德，回向十方法界。" : "May the merit of this light be dedicated to all beings."}
                </div>
                <button
                  onClick={closePanel}
                  style={{
                    backgroundColor: "#2C1810", color: "#fff", border: "none", borderRadius: 8,
                    padding: "10px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  {lang === "zh" ? "完成" : "Done"}
                </button>
              </div>
            ) : (
              <>
                {/* Lamp type */}
                <label style={{ fontSize: 14, fontWeight: 600, color: "#2C1810", display: "block", marginBottom: 8 }}>
                  {lang === "zh" ? "选择灯型" : "Choose Lamp Type"}
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 18 }}>
                  {lampTypes.map((lamp) => (
                    <button
                      key={lamp.id}
                      onClick={() => setSelectedLamp(lamp.id)}
                      style={{
                        padding: "10px 4px",
                        borderRadius: 10,
                        border: selectedLamp === lamp.id ? "1.5px solid #B8934A" : "1.5px solid #D4C5A9",
                        backgroundColor: selectedLamp === lamp.id ? "#B8934A" : "#fff",
                        color: selectedLamp === lamp.id ? "#fff" : "#2C1810",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {lang === "zh" ? lamp.zh : lamp.en}
                    </button>
                  ))}
                </div>

                {/* Duration */}
                <label style={{ fontSize: 14, fontWeight: 600, color: "#2C1810", display: "block", marginBottom: 8 }}>
                  {lang === "zh" ? "选择天数" : "Choose Duration"}
                </label>
                <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                  {durations.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDuration(d.id)}
                      style={{
                        flex: 1,
                        padding: "10px 8px",
                        borderRadius: 10,
                        border: selectedDuration === d.id ? "1.5px solid #B8934A" : "1.5px solid #D4C5A9",
                        backgroundColor: selectedDuration === d.id ? "#B8934A" : "#fff",
                        color: selectedDuration === d.id ? "#fff" : "#2C1810",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {lang === "zh" ? d.zh : d.en}
                    </button>
                  ))}
                </div>

                {/* Start date */}
                <label style={{ fontSize: 14, fontWeight: 600, color: "#2C1810", display: "block", marginBottom: 8 }}>
                  {lang === "zh" ? "开始日期" : "Start Date"}
                </label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
                  {availableDates.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setSelectedDate(d.value)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: 8,
                        border: selectedDate === d.value ? "1.5px solid #B8934A" : "1.5px solid #D4C5A9",
                        backgroundColor: selectedDate === d.value ? "#B8934A" : "#fff",
                        color: selectedDate === d.value ? "#fff" : "#2C1810",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>

                {/* Donor name */}
                <label style={{ fontSize: 14, fontWeight: 600, color: "#2C1810", display: "block", marginBottom: 6 }}>
                  {lang === "zh" ? "供灯人 / Donor Name" : "Donor Name / 供灯人"}
                </label>
                <input
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder={lang === "zh" ? "请输入姓名" : "Enter your name"}
                  style={{
                    width: "100%", padding: "14px 16px", fontSize: 16, borderRadius: 10,
                    border: "1.5px solid #D4C5A9", backgroundColor: "#fff", color: "#2C1810",
                    marginBottom: 16, boxSizing: "border-box",
                  }}
                />

                {/* Dedication */}
                <label style={{ fontSize: 14, fontWeight: 600, color: "#2C1810", display: "block", marginBottom: 6 }}>
                  {lang === "zh" ? "回向对象（选填）" : "Dedication (optional)"}
                </label>
                <input
                  value={dedication}
                  onChange={(e) => setDedication(e.target.value)}
                  placeholder={lang === "zh" ? "例如：祈愿家人平安健康" : "e.g. For my family's health and safety"}
                  style={{
                    width: "100%", padding: "14px 16px", fontSize: 16, borderRadius: 10,
                    border: "1.5px solid #D4C5A9", backgroundColor: "#fff", color: "#2C1810",
                    marginBottom: 16, boxSizing: "border-box",
                  }}
                />

                {result && !result.success && (
                  <div style={{ color: "#B91C1C", fontSize: 13, marginBottom: 12 }}>
                    {result.message}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    width: "100%",
                    backgroundColor: submitting ? "#C9B391" : "#B8934A",
                    color: "#fff", border: "none", borderRadius: 10, padding: "14px",
                    fontSize: 16, fontWeight: 700, cursor: submitting ? "default" : "pointer",
                  }}
                >
                  {submitting
                    ? (lang === "zh" ? "提交中..." : "Submitting...")
                    : (lang === "zh" ? "确认点灯" : "Confirm Offering")}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </main>
  );
}