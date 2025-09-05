"use client";

import { Card, CardContent } from "@/components/ui/card";

type HistoryItem = {
  type: "url" | "email";
  input: string;
  result: string;
};

export default function History({ history }: { history: HistoryItem[] }) {
  return (
    <Card className="w-full max-w-lg shadow-md">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">History</h2>
        {history.length === 0 ? (
          <p className="text-gray-500 text-center">
            No history yet. Try checking something.
          </p>
        ) : (
          <ul className="space-y-2">
            {history.map((item, index) => (
              <li
                key={index}
                className="flex justify-between border-b py-2 text-sm"
              >
                <span className="truncate max-w-[70%]">
                  {item.type === "url" ? "🌐" : "📧"} {item.input}
                </span>
                <span
                  className={
                    item.result.includes("Safe")
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {item.result}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
