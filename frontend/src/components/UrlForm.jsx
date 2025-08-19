import React, { useState } from 'react'
import axios from 'axios'

export default function UrlForm({ onLoading, onResult, onError }) {
  const [url, setUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!url.trim()) {
      onError('Please enter a URL')
      return
    }
    try {
      setSubmitting(true)
      onLoading(true)
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050'
      const res = await axios.post(`${apiBase}/api/analyze`, { url })
      onResult(res.data)
    } catch (err) {
      const message = err?.response?.data?.error || 'Failed to analyze the URL'
      onError(message)
    } finally {
      setSubmitting(false)
      onLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <input
        type="url"
        name="url"
        placeholder="https://example.com/login.php"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1 rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={submitting}
        className="relative rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-60"
      >
        {submitting ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            Analyzing...
          </span>
        ) : (
          'Analyze'
        )}
      </button>
    </form>
  )
}


