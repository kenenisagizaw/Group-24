"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import History from "@/components/History";

type HistoryItem = {
  type: "email";
  input: string;
  result: string;
};

export default function EmailPage() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("emailHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleSubmit = async () => {
    const res = await fetch("/api/detect", {
      method: "POST",
      body: JSON.stringify({ input, type: "email" }),
    });
    const data = await res.json();

    const newItem: HistoryItem = { type: "email", input, result: String(data.verdict) };
const updatedHistory: HistoryItem[] = [newItem, ...history];
setHistory(updatedHistory);
localStorage.setItem("emailHistory", JSON.stringify(updatedHistory));


    router.push(`/result?input=${encodeURIComponent(input)}&verdict=${data.verdict}&type=email`);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("emailHistory");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <Card className="max-w-lg w-full shadow-xl border border-gray-200 rounded-2xl mb-10">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-center">📧 Email Phishing Detector</h1>
          <Input
            placeholder="Enter Email..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button className="w-full" onClick={handleSubmit}>
            🚀 Check Email
          </Button>
        </CardContent>
      </Card>

      <div className="max-w-lg w-full">
        <History history={history} />
        {history.length > 0 && (
          <Button variant="destructive" className="mt-4 w-full" onClick={clearHistory}>
            🗑️ Clear Email History
          </Button>
        )}
      </div>
    </div>
  );
}
