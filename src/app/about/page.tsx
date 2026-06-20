"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home as HomeIcon, Landmark, Heart, Globe2, Phone, Mail, MapPin, Sparkles } from "lucide-react";

export default function AboutPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const [isMobile, setIsMobile] = useState(false);

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

  const sections = [
    {
      icon: <Landmark size={28} strokeWidth={1.5} />,
      titleZh: "关于菩提禅修",
      titleEn: "About Bodhi Meditation",
      bodyZh: "菩提禅修是一个国际性的禅修组织，由金菩提宗师于1991年创立，致力于推广简单易学且有效的禅修方法。三十多年来，无数学员通过持续练习，逐步缓解身心方面的困扰，重新找回内在的平静与活力，并将这份健康与快乐带入日常生活的方方面面。",
      bodyEn: "Bodhi Meditation is an international organization founded in 1991 by Grandmaster JinBodhi, dedicated to teaching simple, effective meditation methods. Over three decades, countless practitioners have used consistent practice to ease physical and emotional struggles, rediscover inner calm, and carry that sense of health and happiness into daily life.",
    },
    {
      icon: <Heart size={28} strokeWidth={1.5} />,
      titleZh: "我们的使命",
      titleEn: "Our Mission",
      bodyZh: "我们以慈悲与平和为核心理念，引导学员通过观想式禅修，连接宇宙能量，从而舒缓身心压力，疗愈情绪困扰。无论年龄、文化背景或信仰为何，每个人都能在这里找到适合自己的练习方式，活出健康、自在、充满觉知的生命状态。",
      bodyEn: "Guided by compassion and inner peace, we use visualization-based meditation to help students connect with universal energy, easing stress and emotional struggles at their root. Regardless of age, background, or belief, everyone can find a practice suited to them and move toward a healthier, more balanced, and more aware way of living.",
    },
    {
      icon: <Sparkles size={28} strokeWidth={1.5} />,
      titleZh: "我们的特色",
      titleEn: "Our Uniqueness",
      bodyZh: "菩提禅修的方法源于创办人多年的修行心得，简单实用，特别适合现代快节奏的生活方式。我们不仅关注身体健康，更着重于从根源上探索压力与情绪的来源，帮助学员达到身心真正的和谐与安顿。",
      bodyEn: "Bodhi Meditation's methods are drawn from the founder's years of personal practice, designed to be simple and practical for today's fast-paced lifestyle. Beyond physical wellbeing, we focus on exploring the root causes of stress and emotional imbalance, helping students reach genuine harmony between body and mind.",
    },
    {
      icon: <Globe2 size={28} strokeWidth={1.5} />,
      titleZh: "全球社区",
      titleEn: "Global Community",
      bodyZh: "菩提禅修的足迹已遍及全球50多个国家与地区，并在美国、加拿大、台湾、韩国等十余个国家和地区设有正式禅堂。各地禅堂长期举办公益活动、能量加持与禅修课程，将健康与慈悲的理念传递给更多社区与家庭。",
      bodyEn: "Bodhi Meditation has spread to over 50 countries and regions, with official centers in more than 10 places including the U.S., Canada, Taiwan, and South Korea. Centers around the world regularly host community outreach, energy blessing services, and meditation programs, bringing the values of health and compassion to more families and neighborhoods.",
    },
  ];

  return (
    <main style={{ backgroundColor: "#F5F0E8", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
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
            {lang === "zh" ? "禅堂介绍" : "About Us"}
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

      {/* Content */}
      <div style={{
        flex: 1,
        padding: isMobile ? "16px" : "32px 48px",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? 16 : 32,
        width: "100%",
        maxWidth: 1400,
        margin: "0 auto",
        boxSizing: "border-box",
      }}>
        {/* Left — org name + photo placeholder */}
        <div style={{
          width: isMobile ? "100%" : 320,
          flexShrink: 0,
          borderRadius: 16,
          backgroundColor: "#2C1810",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "24px 16px" : "40px 28px",
          textAlign: "center",
          color: "#B8934A",
        }}>
          <Landmark size={isMobile ? 56 : 72} strokeWidth={1} />
          <p style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700, marginTop: 14, marginBottom: 2 }}>
            菩提禅堂
          </p>
          <p style={{ fontSize: isMobile ? 13 : 14, opacity: 0.85, marginBottom: 16 }}>
            Bodhi Meditation San Francisco
          </p>

          <div style={{ width: "100%", borderTop: "1px solid rgba(184,147,74,0.3)", paddingTop: 16, textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10, fontSize: 13 }}>
              <Phone size={16} style={{ marginTop: 2, flexShrink: 0 }} />
              <span>415-665-5136</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10, fontSize: 13 }}>
              <MapPin size={16} style={{ marginTop: 2, flexShrink: 0 }} />
              <span>327 Divisadero St, San Francisco, CA 94117</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13 }}>
              <Mail size={16} style={{ marginTop: 2, flexShrink: 0 }} />
              <span>info@bodhisf.org</span>
            </div>
          </div>
        </div>

        {/* Right — sections */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: isMobile ? 12 : 16 }}>
          {sections.map((sec, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#EDE5D8",
                border: "1.5px solid #D4C5A9",
                borderRadius: 14,
                padding: isMobile ? "16px" : "20px 24px",
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                backgroundColor: "#B8934A",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                {sec.icon}
              </div>
              <div>
                <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: "#2C1810", marginBottom: 6 }}>
                  {lang === "zh" ? sec.titleZh : sec.titleEn}
                </div>
                <div style={{ fontSize: isMobile ? 13 : 14, color: "#6B4C35", lineHeight: 1.6 }}>
                  {lang === "zh" ? sec.bodyZh : sec.bodyEn}
                </div>
              </div>
            </div>
          ))}
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
    </main>
  );
}