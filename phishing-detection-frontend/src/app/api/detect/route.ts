import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { url, emailText } = await req.json();

  let verdict = "safe";
  let confidence = 70;
  const signals: string[] = [];

  if (url && url.includes("login")) {
    verdict = "phishing";
    confidence = 85;
    signals.push("Suspicious URL keyword: login");
  }

  if (emailText && emailText.toLowerCase().includes("urgent")) {
    verdict = "phishing";
    confidence = 90;
    signals.push("Email contains urgent wording");
  }

  return NextResponse.json({ verdict, confidence, signals });
}
