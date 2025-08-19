import React, { useState } from 'react'
import UrlForm from './components/UrlForm.jsx'
import ResultCard from './components/ResultCard.jsx'

export default function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  return (
    <div className="min-h-full grid place-items-center bg-gray-50">
      <div className="w-full max-w-2xl px-4 py-16">
        <h1 className="text-3xl font-bold text-center mb-8">Phishing URL Detector</h1>
        <UrlForm
          onLoading={setLoading}
          onResult={(r) => { setResult(r); setError('') }}
          onError={(e) => { setError(e); setResult(null) }}
        />

        {error && (
          <div className="mt-6 rounded border border-red-200 bg-red-50 text-red-700 p-4 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8">
            <ResultCard data={result} />
          </div>
        )}
      </div>
    </div>
  )}


