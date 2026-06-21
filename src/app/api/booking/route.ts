import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/src/lib/redis";

function generateRefCode(prefix: string) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${code}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, name, phone, service, message, preferredDate } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: "Name and phone are required" },
        { status: 400 }
      );
    }

    const prefix = type === "blessing-request" ? "PR" : "BK";
    const refCode = generateRefCode(prefix);

    const record = {
      type: type || "general",
      name,
      phone,
      service: service || "",
      message: message || "",
      preferredDate: preferredDate || "",
      refCode,
      submittedAt: new Date().toISOString(),
    };

    await redis.zadd("bookings", {
      score: Date.now(),
      member: JSON.stringify(record),
    });

    return NextResponse.json({ success: true, refCode });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error, please try again" },
      { status: 500 }
    );
  }
}