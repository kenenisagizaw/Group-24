import React from 'react'

export default function ResultCard({ data }) {
  const { url, is_phishing, score, rules_triggered } = data
  const percent = Math.round((score || 0) * 100)
  const headerText = is_phishing ? 'Likely Phishing 🚨' : 'Likely Legitimate ✅'
  const headerColor = is_phishing ? 'bg-red-100 text-red-800 border-red-200' : 'bg-green-100 text-green-800 border-green-200'

  const triggered = (rules_triggered || []).filter(r => r.matched)

  return (
    <div className="rounded border bg-white shadow-sm">
      <div className={`px-4 py-3 border-b font-medium ${headerColor}`}>
        {headerText}
      </div>
      <div className="p-4 space-y-3">
        <div className="text-sm text-gray-600 break-all">{url}</div>
        <div className="text-sm">Confidence: <span className="font-semibold">{percent}%</span></div>
        {triggered.length > 0 ? (
          <div>
            <div className="text-sm font-semibold mb-2">Triggered rules</div>
            <ul className="list-disc pl-6 space-y-1">
              {triggered.map(rule => (
                <li key={rule.rule_name} className="text-sm">{rule.description}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-sm text-gray-500">No rules triggered.</div>
        )}
      </div>
    </div>
  )
}


