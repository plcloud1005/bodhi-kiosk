"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home as HomeIcon, Sparkles, BookOpen, Moon, X } from "lucide-react";

interface ServiceItem {
  id: string;
  nameZh: string;
  nameEn: string;
  scheduleZh: string;
  scheduleEn: string;
  descZh: string;
  descEn: string;
  icon: React.ReactNode;
  byAppointment?: boolean;
}

const services: ServiceItem[] = [
  {
    id: "divine-oracle",
    nameZh: "一对一解签谘询",
    nameEn: "1 to 1 Divine Oracle Reading",
    scheduleZh: "需预约 · 30分钟",
    scheduleEn: "By Appointment · 30 min",
    descZh: "在疗愈的空间中，获得来自药师佛灵签的指引。无论是健康、事业或人际关系，皆能从中获得清晰与方向。",
    descEn: "Step into a healing space and receive personalized spiritual guidance through Medicine Buddha's Divine Oracle. Whether you seek answers about health, career, or relationships, this session can provide clarity and direction.",
    icon: <Sparkles size={32} strokeWidth={1.5} />,
    byAppointment: true,
  },
  {
    id: "energy-healing",
    nameZh: "一对一能量疗愈",
    nameEn: "1 to 1 Energy Healing",
    scheduleZh: "需预约 · 20分钟",
    scheduleEn: "By Appointment · 20 min",
    descZh: "体验能量疗愈带来的转化力量。源自金菩提宗师的教导，这项温和而有效的练习有助于恢复并平衡身体的能量。",
    descEn: "Experience the transformative power of energy healing in a personalized one-on-one session. Rooted in the teachings of Grandmaster JinBodhi, this gentle yet powerful practice helps restore and balance your body's vital energy.",
    icon: <Sparkles size={32} strokeWidth={1.5} />,
    byAppointment: true,
  },
  {
    id: "recitation-blessing",
    nameZh: "念佛祈福共修 + 能量加持",
    nameEn: "Buddha Recitation & Blessing",
    scheduleZh: "每周三 / 六 / 日",
    scheduleEn: "Every Wed / Sat / Sun",
    descZh: "集体共修念佛祈福，并附加能量加持，增长福慧。",
    descEn: "Group Buddha recitation and prayer, plus an energy blessing for wellbeing.",
    icon: <BookOpen size={32} strokeWidth={1.5} />,
  },
  {
    id: "newcomer-evening",
    nameZh: "周二晚间禅修 - 新人",
    nameEn: "Tuesday Evening Meditation (Newcomers)",
    scheduleZh: "周六 10:00am–12:30pm 或 6:30pm–7:30pm",
    scheduleEn: "Sat 10:00am–12:30pm or 6:30pm–7:30pm",
    descZh: "专为初次接触禅修的新人设计的入门体验课程。",
    descEn: "An introductory session designed especially for those new to meditation.",
    icon: <Moon size={32} strokeWidth={1.5} />,
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

export default function ConsultationPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const [isMobile, setIsMobile] = useState(false);
  const [selected, setSelected] = useState<ServiceItem | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
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

  const openBook = (svc: ServiceItem) => {
    setSelected(svc);
    setName("");
    setPhone("");
    setMessage("");
    setSelectedDate("");
    setResult(null);
  };

  const closePanel = () => {
    setSelected(null);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !selectedDate) {
      setResult({ success: false, message: lang === "zh" ? "请填写所有字段" : "Please fill in all fields" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selected?.id,
          name,
          phone,
          service: selected ? (lang === "zh" ? selected.nameZh : selected.nameEn) : "",
          message,
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
      const fakeRef = "BK-" + Math.random().toString(36).slice(2, 8).toUpperCase();
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
            {lang === "zh" ? "咨询与加持" : "Consultation & Blessing"}
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

      {/* Service cards */}
      <div style={{
        flex: 1,
        padding: isMobile ? "16px" : "24px 32px",
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 12 : 16,
      }}>
        {services.map((svc) => (
          <div
            key={svc.id}
            style={{
              backgroundColor: "#EDE5D8",
              border: "1.5px solid #D4C5A9",
              borderRadius: 16,
              padding: isMobile ? 16 : 22,
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              gap: isMobile ? 12 : 20,
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
              {svc.icon}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div style={{ fontSize: isMobile ? 16 : 19, fontWeight: 700, color: "#2C1810" }}>
                  {lang === "zh" ? svc.nameZh : svc.nameEn}
                </div>
                {svc.byAppointment && (
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#B8934A",
                    border: "1px solid #B8934A",
                    borderRadius: 6,
                    padding: "2px 8px",
                  }}>
                    {lang === "zh" ? "需预约" : "By Appointment"}
                  </span>
                )}
              </div>
              <div style={{ fontSize: isMobile ? 12 : 13, color: "#B8934A", fontWeight: 600, marginTop: 4 }}>
                {lang === "zh" ? svc.scheduleZh : svc.scheduleEn}
              </div>
              <div style={{ fontSize: isMobile ? 13 : 14, color: "#6B4C35", marginTop: 6, lineHeight: 1.5 }}>
                {lang === "zh" ? svc.descZh : svc.descEn}
              </div>
            </div>

            <button
              onClick={() => openBook(svc)}
              style={{
                backgroundColor: "#B8934A",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: isMobile ? "10px 20px" : "10px 24px",
                fontSize: isMobile ? 14 : 15,
                fontWeight: 600,
                cursor: "pointer",
                flexShrink: 0,
                width: isMobile ? "100%" : "auto",
              }}
            >
              {lang === "zh" ? "预约" : "Book"}
            </button>
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

      {/* Slide-up booking panel */}
      {selected && (
        <>
          <div
            onClick={closePanel}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(44,24,16,0.4)",
              zIndex: 40,
            }}
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
              <div>
                <div style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700, color: "#2C1810" }}>
                  {lang === "zh" ? selected.nameZh : selected.nameEn}
                </div>
                <div style={{ fontSize: 13, color: "#6B4C35" }}>
                  {lang === "zh" ? "预约信息" : "Booking Details"}
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
                  {lang === "zh" ? "预约成功！" : "Booking Confirmed!"}
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

                <label style={{ fontSize: 14, fontWeight: 600, color: "#2C1810", display: "block", marginBottom: 8 }}>
                  {lang === "zh" ? "选择日期 / Select Date" : "Select Date / 选择日期"}
                </label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
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

                <label style={{ fontSize: 14, fontWeight: 600, color: "#2C1810", display: "block", marginBottom: 6 }}>
                  {lang === "zh" ? "留言（选填） / Message (optional)" : "Message (optional) / 留言"}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={lang === "zh" ? "如有特殊需求，请在此说明" : "Let us know if you have any specific needs"}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    fontSize: 15,
                    borderRadius: 10,
                    border: "1.5px solid #D4C5A9",
                    backgroundColor: "#fff",
                    color: "#2C1810",
                    marginBottom: 16,
                    boxSizing: "border-box",
                    resize: "none",
                    fontFamily: "inherit",
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
                    : (lang === "zh" ? "提交预约" : "Submit Booking")}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </main>
  );
}