import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/src/lib/redis";

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function GET() {
  try {
    const date = todayKey();
    const total = await redis.get<number>(`offering:total:${date}`);
    return NextResponse.json({ totalToday: total ?? 0 });
  } catch (err) {
    return NextResponse.json({ totalToday: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lampType, duration, donorName, dedication, preferredDate } = body;

    if (!lampType || !duration || !donorName || !preferredDate) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const date = todayKey();
    const record = {
      lampType,
      duration,
      donorName,
      dedication: dedication || "",
      preferredDate,
      submittedAt: new Date().toISOString(),
    };

    await redis.lpush("offerings", JSON.stringify(record));
    const newTotal = await redis.incr(`offering:total:${date}`);
    await redis.incr(`offering:count:${lampType}:${date}`);

    return NextResponse.json({ success: true, totalToday: newTotal });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error, please try again" },
      { status: 500 }
    );
  }
}