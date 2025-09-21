"use client";

import History from "@/components/History";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type HistoryItem = {
  type: "url" | "email";
  input: string;
  result: string;
};

export default function ResultPage() {
  const params = useSearchParams();
  const router = useRouter();
  const verdict = params.get("verdict");
  const input = params.get("input");
  const type = params.get("type");

  // History state
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Email input & validation
  const [emailInput, setEmailInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("history");
  };

  // Handle email validation & submission
  const handleCheckEmail = () => {
    const email = emailInput.trim();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(email)) {
      setErrorMsg("Please enter a valid email address!");
      return;
    }

    setErrorMsg(""); // clear error

    // Add to history
    const newItem: HistoryItem = { type: "email", input: email, result: "safe" };
    const updatedHistory = [newItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("history", JSON.stringify(updatedHistory));

    // Navigate to result page
    router.push(`/result?type=email&input=${encodeURIComponent(email)}&verdict=safe`);
    setEmailInput(""); // clear input
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-indigo-50 via-white to-gray-100 p-8">

      {/* Email Check Form */}
      <div className="mb-12 max-w-xl w-full">
        <label htmlFor="emailInput" className="text-gray-700 font-medium text-lg mb-2 block">
          Enter email to check:
        </label>
        <div className="flex gap-3">
          <input
            id="emailInput"
            type="text"
            placeholder="user@example.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <Button
            className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            onClick={handleCheckEmail}
          >
            Check for Phishing
          </Button>
        </div>
        {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
      </div>

      {/* Result Card */}
      {input && verdict && (
        <Card className="max-w-xl w-full shadow-2xl border border-gray-100 rounded-3xl bg-white/80 backdrop-blur mb-12">
          <CardContent className="p-10 text-center">
            <h1 className="text-4xl font-extrabold mb-8 text-gray-900 tracking-tight">
              Phishing Detection Result
            </h1>

            <div
              className={`w-36 h-36 mx-auto mb-8 flex items-center justify-center rounded-full shadow-2xl text-6xl font-bold animate-pop ${
                verdict === "safe"
                  ? "bg-gradient-to-br from-green-400 to-green-600 text-white border-4 border-green-500"
                  : "bg-gradient-to-br from-red-400 to-red-600 text-white border-4 border-red-500"
              }`}
            >
              {verdict === "safe" ? "✔" : "✘"}
            </div>

            <div className="mb-8">
              <p className="text-gray-500 text-lg mb-2">
                <strong className="text-gray-700">Checked:</strong>{" "}
                {type === "url" ? "🌐 URL" : "📧 Email"}
              </p>
              <p className="text-gray-800 font-medium italic break-words bg-gray-50 rounded-lg p-3 shadow-sm">
                {input}
              </p>
            </div>

            <p
              className={`text-2xl font-bold mb-10 ${
                verdict === "safe" ? "text-green-600" : "text-red-600"
              }`}
            >
              {verdict === "safe" ? "✅ This input looks Safe" : "🚨 Phishing Detected!"}
            </p>

            <Button
              className="px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => router.push("/")}
            >
              🔙 Back to Home
            </Button>
          </CardContent>
        </Card>
      )}

      {/* History Section */}
      <div className="mt-12 max-w-xl w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">History</h2>
        <Card className="shadow-md border border-gray-200 rounded-2xl">
          <CardContent className="p-6">
            <History history={history} />
            {history.length > 0 && (
              <Button
                variant="destructive"
                className="mt-6 w-full py-3 rounded-xl text-lg shadow-md hover:shadow-lg"
                onClick={clearHistory}
              >
                🗑️ Clear History
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}