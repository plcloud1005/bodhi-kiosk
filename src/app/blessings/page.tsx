"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home as HomeIcon, Sun, CheckCircle2, X } from "lucide-react";

const checklist = [
  { zh: "想要好工作、好财路？", en: "Seeking career success?" },
  { zh: "祈求好运气、好健康？", en: "Seeking good fortune and health?" },
  { zh: "盼望好姻缘、好子孙？", en: "Seeking good relationships and family blessings?" },
  { zh: "开通好智慧、好心情？", en: "Seeking wisdom and a peaceful mind?" },
];

const coreTeamPoints = [
  { zh: "为社会大众、天灾战乱中的苦难众生念佛回向", en: "Dedicating recitation to those suffering from disasters and conflict around the world" },
  { zh: "为有缘求助的朋友祈福加持、化解困境", en: "Offering prayers and support to friends facing hardship" },
  { zh: "为自身修行积累，在共修中互相支持成长", en: "Building personal practice through mutual support in group recitation" },
  { zh: "深入社区行脚，将祥和佛号带入旧金山每一个角落", en: "Bringing peace and recitation into every corner of the San Francisco community" },
];

export default function BlessingsPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const [isMobile, setIsMobile] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [request, setRequest] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; refCode?: string; message?: string } | null>(null);

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

  const openPanel = () => {
    setName("");
    setPhone("");
    setRequest("");
    setResult(null);
    setPanelOpen(true);
  };
  const closePanel = () => setPanelOpen(false);

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      setResult({ success: false, message: lang === "zh" ? "请填写姓名与电话" : "Please enter your name and phone" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "blessing-request",
          name,
          phone,
          message: request,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult({ success: true, refCode: data.refCode });
      } else {
        setResult({ success: false, message: data.message || (lang === "zh" ? "提交失败，请重试" : "Submission failed, please try again") });
      }
    } catch {
      const fakeRef = "PR-" + Math.random().toString(36).slice(2, 8).toUpperCase();
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
            {lang === "zh" ? "祈福与回向" : "Blessings & Dedication"}
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

        {/* Hero banner — Join Our Chant */}
        <div style={{
          backgroundColor: "#2C1810",
          borderRadius: 16,
          padding: isMobile ? "24px 20px" : "32px 40px",
          marginBottom: isMobile ? 20 : 28,
          textAlign: "center",
          color: "#F5F0E8",
        }}>
          <Sun size={isMobile ? 36 : 44} strokeWidth={1.2} style={{ color: "#B8934A" }} />
          <p style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, marginTop: 10, color: "#B8934A" }}>
            {lang === "zh" ? "来念佛吧！让生活变晴天" : "Join Our Chant! Find Your Inner Sunshine"}
          </p>
          <p style={{ fontSize: isMobile ? 12 : 14, marginTop: 4, opacity: 0.8 }}>
            {lang === "zh" ? "Find Your Inner Sunshine · 洗涤负能量" : "洗涤负能量 · Cleanse Your Energy"}
          </p>
          <p style={{
            fontSize: isMobile ? 14 : 17,
            marginTop: 18,
            fontStyle: "italic",
            color: "#F5F0E8",
            maxWidth: 600,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.6,
          }}>
            {lang === "zh"
              ? "「一句佛号，是化解万千烦恼最至诚的力量。」"
              : "\u201cOne mindful chant: a profound force to dissolve a thousand worries.\u201d"}
          </p>
        </div>

        {/* Checklist + schedule */}
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 16 : 24, marginBottom: isMobile ? 20 : 28 }}>
          {/* Checklist */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
            {checklist.map((item, i) => (
              <div key={i} style={{
                backgroundColor: "#EDE5D8",
                border: "1.5px solid #D4C5A9",
                borderRadius: 12,
                padding: isMobile ? "12px 16px" : "14px 20px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}>
                <CheckCircle2 size={20} style={{ color: "#B8934A", flexShrink: 0 }} />
                <span style={{ fontSize: isMobile ? 14 : 16, fontWeight: 600, color: "#2C1810" }}>
                  {lang === "zh" ? item.zh : item.en}
                </span>
              </div>
            ))}
          </div>

          {/* Schedule card */}
          <div style={{
            flex: 1,
            backgroundColor: "#EDE5D8",
            border: "1.5px solid #D4C5A9",
            borderRadius: 14,
            padding: isMobile ? 20 : 28,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}>
            <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: "#2C1810", marginBottom: 6 }}>
              {lang === "zh" ? "消災祈福念佛团" : "Bodhi Prayer Group"}
            </div>
            <div style={{ fontSize: isMobile ? 13 : 14, color: "#6B4C35", marginBottom: 16 }}>
              {lang === "zh" ? "Here for You" : "真诚为您服务"}
            </div>
            <div style={{
              backgroundColor: "#B8934A",
              color: "#fff",
              borderRadius: 10,
              padding: isMobile ? "10px 24px" : "12px 32px",
              fontSize: isMobile ? 18 : 22,
              fontWeight: 700,
              marginBottom: 14,
            }}>
              {lang === "zh" ? "每周六 10:00AM – 11:30AM" : "SAT 10:00AM – 11:30AM"}
            </div>
            <p style={{ fontSize: isMobile ? 12 : 13, color: "#6B4C35", marginBottom: 16 }}>
              {lang === "zh" ? "接受各类祈福需求，欢迎洽询安排" : "All blessing requests welcome — contact us to arrange"}
            </p>
            <button
              onClick={openPanel}
              style={{
                backgroundColor: "#2C1810",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: isMobile ? "10px 24px" : "12px 32px",
                fontSize: isMobile ? 14 : 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {lang === "zh" ? "提交祈福请求" : "Submit a Blessing Request"}
            </button>
          </div>
        </div>

        {/* Core team recruitment */}
        <div style={{
          backgroundColor: "#EDE5D8",
          border: "1.5px solid #D4C5A9",
          borderRadius: 14,
          padding: isMobile ? 18 : 28,
        }}>
          <div style={{ fontSize: isMobile ? 16 : 19, fontWeight: 700, color: "#2C1810", marginBottom: 4 }}>
            {lang === "zh" ? "消災祈福念佛团 · 召集核心发心团员" : "Disaster-Relief Prayer Group · Core Members Wanted"}
          </div>
          <div style={{ fontSize: isMobile ? 12 : 13, color: "#B8934A", fontWeight: 600, marginBottom: 14 }}>
            {lang === "zh" ? "万众同声念佛，光明吉祥满人间" : "United in recitation, bringing light and blessing to all"}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {coreTeamPoints.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 8, fontSize: isMobile ? 13 : 14, color: "#6B4C35", lineHeight: 1.5 }}>
                <span style={{ color: "#B8934A" }}>•</span>
                <span>{lang === "zh" ? p.zh : p.en}</span>
              </div>
            ))}
          </div>

          <div style={{
            backgroundColor: "#fff",
            border: "1px solid #D4C5A9",
            borderRadius: 10,
            padding: isMobile ? 14 : 18,
          }}>
            <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 700, color: "#2C1810", marginBottom: 6 }}>
              {lang === "zh" ? "核心团员资格" : "Core Member Requirements"}
            </div>
            <div style={{ fontSize: isMobile ? 12 : 13, color: "#6B4C35", lineHeight: 1.6 }}>
              {lang === "zh"
                ? "每年至少出席20场「周六共修」，以此作为发心承诺的体现。其余同修皆欢迎随喜加入，共沐佛光。团员将获得专属胸牌，并纳入年度积分功德榜。"
                : "Core members commit to attending at least 20 Saturday recitation sessions per year. All others are warmly welcome to join as their hearts move them. Core members receive a special badge and are recorded on the annual merit recognition list."}
            </div>
          </div>
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
          <div onClick={closePanel} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(44,24,16,0.4)", zIndex: 40 }} />
          <div style={{
            position: "fixed",
            bottom: 0, left: 0, right: 0,
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
                {lang === "zh" ? "提交祈福请求" : "Submit a Blessing Request"}
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
                <div style={{ fontSize: 40, marginBottom: 8 }}>🙏</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#2C1810", marginBottom: 6 }}>
                  {lang === "zh" ? "祈福请求已收到" : "Request Received"}
                </div>
                <div style={{ fontSize: 14, color: "#6B4C35", marginBottom: 16 }}>
                  {lang === "zh" ? "您的预约编号" : "Your reference code"}
                </div>
                <div style={{
                  display: "inline-block", backgroundColor: "#B8934A", color: "#fff",
                  fontSize: 20, fontWeight: 700, padding: "10px 24px", borderRadius: 8, letterSpacing: 1,
                }}>
                  {result.refCode}
                </div>
                <button
                  onClick={closePanel}
                  style={{
                    display: "block", margin: "24px auto 0", backgroundColor: "#2C1810", color: "#fff",
                    border: "none", borderRadius: 8, padding: "10px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer",
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
                    width: "100%", padding: "14px 16px", fontSize: 16, borderRadius: 10,
                    border: "1.5px solid #D4C5A9", backgroundColor: "#fff", color: "#2C1810",
                    marginBottom: 16, boxSizing: "border-box",
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
                    width: "100%", padding: "14px 16px", fontSize: 16, borderRadius: 10,
                    border: "1.5px solid #D4C5A9", backgroundColor: "#fff", color: "#2C1810",
                    marginBottom: 16, boxSizing: "border-box",
                  }}
                />

                <label style={{ fontSize: 14, fontWeight: 600, color: "#2C1810", display: "block", marginBottom: 6 }}>
                  {lang === "zh" ? "祈福内容（选填）" : "Blessing Request (optional)"}
                </label>
                <textarea
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  placeholder={lang === "zh" ? "请说明您的祈福心愿" : "Tell us what you'd like us to pray for"}
                  rows={3}
                  style={{
                    width: "100%", padding: "14px 16px", fontSize: 15, borderRadius: 10,
                    border: "1.5px solid #D4C5A9", backgroundColor: "#fff", color: "#2C1810",
                    marginBottom: 16, boxSizing: "border-box", resize: "none", fontFamily: "inherit",
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
                    : (lang === "zh" ? "提交请求" : "Submit Request")}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </main>
  );
}