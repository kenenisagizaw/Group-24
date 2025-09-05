"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import History from "@/components/History";

type HistoryItem = {
  type: "url" | "email";
  input: string;
  result: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [type, setType] = useState<"url" | "email">("url");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleSubmit = async () => {
    const res = await fetch("/api/detect", {
      method: "POST",
      body: JSON.stringify({ input, type }),
    });
    const data = await res.json();

    const newItem = { type, input, result: data.verdict };
    const updatedHistory = [newItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("history", JSON.stringify(updatedHistory));

    router.push(
      `/result?input=${encodeURIComponent(input)}&verdict=${data.verdict}&type=${type}`
    );
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("history");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      {/* Input Card */}
      <Card className="max-w-lg w-full shadow-xl border border-gray-200 rounded-2xl mb-10">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-center">🛡️ Phishing Detector</h1>

          <div className="flex gap-2">
            <Button
              variant={type === "url" ? "default" : "outline"}
              onClick={() => setType("url")}
            >
              🌐 URL
            </Button>
            <Button
              variant={type === "email" ? "default" : "outline"}
              onClick={() => setType("email")}
            >
              📧 Email
            </Button>
          </div>

          <Input
            placeholder={type === "url" ? "Enter URL..." : "Enter Email..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <Button className="w-full" onClick={handleSubmit}>
            🚀 Check for Phishing
          </Button>
        </CardContent>
      </Card>

      {/* History */}
      <div className="max-w-lg w-full">
        <History history={history} />
        {history.length > 0 && (
          <Button
            variant="destructive"
            className="mt-4 w-full"
            onClick={clearHistory}
          >
            🗑️ Clear History
          </Button>
        )}
      </div>
    </div>
  );
}
