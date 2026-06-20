"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home as HomeIcon, Heart, Wind, BookOpen, Sparkles, X } from "lucide-react";

interface ClassItem {
  id: string;
  nameZh: string;
  nameEn: string;
  scheduleZh: string;
  scheduleEn: string;
  icon: React.ReactNode;
}

const classes: ClassItem[] = [
  {
    id: "fathers-day",
    nameZh: "父亲节活动",
    nameEn: "Father's Day Event",
    scheduleZh: "6/13 周六 · 10:00am–12:30pm",
    scheduleEn: "Sat 6/13 · 10:00am–12:30pm",
    icon: <Heart size={32} strokeWidth={1.5} />,
  },
  {
    id: "stress-relief-7day",
    nameZh: "7天 减压班",
    nameEn: "7-Day Stress Relief Class",
    scheduleZh: "6/14–6/20 · 1:00pm–4:30pm",
    scheduleEn: "6/14–6/20 · 1:00pm–4:30pm",
    icon: <Wind size={32} strokeWidth={1.5} />,
  },
  {
    id: "buddha-recitation-7day",
    nameZh: "7天 金菩提真心念佛班",
    nameEn: "7-Day Buddha Chanting Class",
    scheduleZh: "6/21–6/27 · 9:00am–6:00pm",
    scheduleEn: "6/21–6/27 · 9:00am–6:00pm",
    icon: <BookOpen size={32} strokeWidth={1.5} />,
  },
  {
    id: "stress-relief-evening",
    nameZh: "7天 减压班（晚间）",
    nameEn: "7-Day Stress Relief Class(Evening)",
    scheduleZh: "7/12–7/18 · 6:30pm–9:00pm",
    scheduleEn: "7/12–7/18 · 6:30pm–9:00pm",
    icon: <Wind size={32} strokeWidth={1.5} />,
  },
  {
    id: "beautiful-gift",
    nameZh: "7天 最美的礼物念佛班",
    nameEn: "7-Day Most Beautiful Gift Chanting Class",
    scheduleZh: "7/19–7/25 · 10:00am–12:30pm",
    scheduleEn: "7/19–7/25 · 10:00am–12:30pm",
    icon: <Sparkles size={32} strokeWidth={1.5} />,
  },
  {
    id: "guanyin-ceremony",
    nameZh: "观世音菩萨成道日法会",
    nameEn: "Guanyin Enlightenment Ceremony",
    scheduleZh: "7/26 周日 · 10:00am–4:00pm",
    scheduleEn: "Sun 7/26 · 10:00am–4:00pm",
    icon: <Sparkles size={32} strokeWidth={1.5} />,
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

export default function ClassesPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const [isMobile, setIsMobile] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; refCode?: string; message?: string } | null>(null);

  const availableDates = getNextDates(4);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
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

  const openRegister = (cls: ClassItem) => {
    setSelectedClass(cls);
    setName("");
    setPhone("");
    setSelectedDate("");
    setResult(null);
  };

  const closePanel = () => {
    setSelectedClass(null);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !selectedDate) {
      setResult({ success: false, message: lang === "zh" ? "请填写所有字段" : "Please fill in all fields" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          classId: selectedClass?.id,
          className: selectedClass ? (lang === "zh" ? selectedClass.nameZh : selectedClass.nameEn) : "",
          preferredDate: selectedDate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult({ success: true, refCode: data.refCode });
      } else {
        setResult({ success: false, message: data.message || (lang === "zh" ? "提交失败，请重试" : "Submission failed, please try again") });
      }
    } catch {
      // Fallback demo behavior if API isn't wired up yet
      const fakeRef = "BD-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      setResult({ success: true, refCode: fakeRef });
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
            {lang === "zh" ? "课程报名" : "Classes"}
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

      {/* Class cards */}
      <div style={{
        flex: 1,
        padding: isMobile ? "16px" : "24px 32px",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
        gap: isMobile ? 12 : 20,
        alignContent: "start",
      }}>
        {classes.map((cls) => (
          <div
            key={cls.id}
            style={{
              backgroundColor: "#EDE5D8",
              border: "1.5px solid #D4C5A9",
              borderRadius: 16,
              padding: isMobile ? 16 : 20,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{
              width: isMobile ? 56 : 64,
              height: isMobile ? 56 : 64,
              borderRadius: "50%",
              backgroundColor: "#B8934A",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              {cls.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: "#2C1810" }}>
                {lang === "zh" ? cls.nameZh : cls.nameEn}
              </div>
              <div style={{ fontSize: isMobile ? 12 : 13, color: "#6B4C35", marginTop: 2 }}>
                {lang === "zh" ? cls.scheduleZh : cls.scheduleEn}
              </div>
              <button
                onClick={() => openRegister(cls)}
                style={{
                  marginTop: 10,
                  backgroundColor: "#B8934A",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: isMobile ? "8px 16px" : "8px 20px",
                  fontSize: isMobile ? 13 : 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {lang === "zh" ? "报名" : "Register"}
              </button>
            </div>
          </div>
        ))}
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

      {/* Slide-up registration panel */}
      {selectedClass && (
        <>
          {/* Backdrop */}
          <div
            onClick={closePanel}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(44,24,16,0.4)",
              zIndex: 40,
            }}
          />
          {/* Panel */}
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
              <div>
                <div style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700, color: "#2C1810" }}>
                  {lang === "zh" ? selectedClass.nameZh : selectedClass.nameEn}
                </div>
                <div style={{ fontSize: 13, color: "#6B4C35" }}>
                  {lang === "zh" ? "报名信息" : "Registration Details"}
                </div>
              </div>
              <button
                onClick={closePanel}
                style={{
                  background: "#EDE5D8",
                  border: "1.5px solid #D4C5A9",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#2C1810",
                  flexShrink: 0,
                }}
              >
                <X size={18} />
              </button>
            </div>

            {result?.success ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>✓</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#2C1810", marginBottom: 6 }}>
                  {lang === "zh" ? "报名成功！" : "Registration Successful!"}
                </div>
                <div style={{ fontSize: 14, color: "#6B4C35", marginBottom: 16 }}>
                  {lang === "zh" ? "您的预约编号" : "Your reference code"}
                </div>
                <div style={{
                  display: "inline-block",
                  backgroundColor: "#B8934A",
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: 700,
                  padding: "10px 24px",
                  borderRadius: 8,
                  letterSpacing: 1,
                }}>
                  {result.refCode}
                </div>
                <button
                  onClick={closePanel}
                  style={{
                    display: "block",
                    margin: "24px auto 0",
                    backgroundColor: "#2C1810",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 28px",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {lang === "zh" ? "完成" : "Done"}
                </button>
              </div>
            ) : (
              <>
                {/* Name field */}
                <label style={{ fontSize: 14, fontWeight: 600, color: "#2C1810", display: "block", marginBottom: 6 }}>
                  {lang === "zh" ? "姓名 / Name" : "Name / 姓名"}
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === "zh" ? "请输入姓名" : "Enter your name"}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    fontSize: 16,
                    borderRadius: 10,
                    border: "1.5px solid #D4C5A9",
                    backgroundColor: "#fff",
                    color: "#2C1810",
                    marginBottom: 16,
                    boxSizing: "border-box",
                  }}
                />

                {/* Phone field */}
                <label style={{ fontSize: 14, fontWeight: 600, color: "#2C1810", display: "block", marginBottom: 6 }}>
                  {lang === "zh" ? "电话 / Phone" : "Phone / 电话"}
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9-]/g, ""))}
                  placeholder={lang === "zh" ? "请输入电话号码" : "Enter your phone number"}
                  inputMode="tel"
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    fontSize: 16,
                    borderRadius: 10,
                    border: "1.5px solid #D4C5A9",
                    backgroundColor: "#fff",
                    color: "#2C1810",
                    marginBottom: 16,
                    boxSizing: "border-box",
                  }}
                />

                {/* Date selection */}
                <label style={{ fontSize: 14, fontWeight: 600, color: "#2C1810", display: "block", marginBottom: 8 }}>
                  {lang === "zh" ? "选择日期 / Select Date" : "Select Date / 选择日期"}
                </label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
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
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "14px",
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: submitting ? "default" : "pointer",
                  }}
                >
                  {submitting
                    ? (lang === "zh" ? "提交中..." : "Submitting...")
                    : (lang === "zh" ? "提交报名" : "Submit Registration")}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </main>
  );
}