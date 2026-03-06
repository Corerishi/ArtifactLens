// frontend/src/pages/History.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API_URL = 'http://localhost:8000'

function History() {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [clearMsg, setClearMsg] = useState(null)

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/history`)
                setHistory(res.data)
            } catch {
                setError('Could not load history. Backend may be offline.')
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [])

    const handleClear = async () => {
        try {
            await axios.delete(`${API_URL}/api/history`)
            setHistory([])
            setClearMsg('History cleared')
            setTimeout(() => setClearMsg(null), 2000)
        } catch {
            setClearMsg('Failed to clear history')
            setTimeout(() => setClearMsg(null), 2000)
        }
    }

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-[#E8E8E8] pt-24 pb-12 animate-page-in">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 animate-card-in">
                    <div>
                        <h1 className="text-3xl font-bold text-[#E8E8E8]">Analysis History</h1>
                        <p className="text-[#888888] text-sm mt-1">Your past deepfake detection results</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {clearMsg && (
                            <span className="text-sm text-[#6EE7B7] animate-pop-in">{clearMsg}</span>
                        )}
                        <button
                            onClick={handleClear}
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#888888] border border-[#2A2A2A]
                                       hover:text-[#F87171] hover:border-[#F87171]/30 hover:bg-[#2D1515]/40 transition-all duration-200"
                        >
                            🗑️ Clear History
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <svg className="w-8 h-8 animate-spin text-[#A78BFA]" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <p className="text-[#888888] text-sm mt-4">Loading history...</p>
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="p-5 rounded-xl bg-[#2D1515]/60 border border-[#F87171]/15 animate-pop-in">
                        <div className="flex items-start gap-3">
                            <span className="text-[#F87171] text-xl">⚠️</span>
                            <p className="text-[#888888] text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && history.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-card-in">
                        <div className="w-20 h-20 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center mb-5">
                            <svg className="w-10 h-10 text-[#555]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-[#E8E8E8]">No analyses yet</h3>
                        <p className="text-[#888888] text-sm mt-2 max-w-xs">
                            Go to Home to scan your first image.
                        </p>
                        <Link
                            to="/"
                            className="mt-5 px-6 py-2.5 rounded-xl text-sm font-semibold
                                       bg-[#A78BFA] text-[#0D0D0D]
                                       hover:bg-[#8B5CF6] hover:scale-[1.02]
                                       active:scale-[0.98] transition-all duration-200"
                        >
                            Go to Home
                        </Link>
                    </div>
                )}

                {/* Results Grid */}
                {!loading && !error && history.length > 0 && (
                    <div className="grid gap-3 animate-card-in">
                        {/* Table Header */}
                        <div className="grid grid-cols-[1fr_100px_140px_100px] gap-4 px-5 py-3 text-xs font-semibold text-[#888888] uppercase tracking-wider">
                            <span>File</span>
                            <span>Result</span>
                            <span>Confidence</span>
                            <span className="text-right">Date</span>
                        </div>

                        {history.map((item) => {
                            const isFake = item.label.toLowerCase() === 'fake'
                            const pct = Math.round(item.confidence * 100)
                            return (
                                <div
                                    key={item._id}
                                    className="grid grid-cols-[1fr_100px_140px_100px] gap-4 items-center px-5 py-4
                                               bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl
                                               hover:border-[#3A3A3A] hover:bg-[#1E1E1E] transition-all duration-200"
                                >
                                    {/* Filename */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 rounded-lg bg-[#141414] border border-[#2A2A2A] flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4 text-[#888888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm text-[#E8E8E8] truncate">{item.filename}</span>
                                    </div>

                                    {/* Label */}
                                    <span className={`text-sm font-bold tracking-wide ${isFake ? 'text-[#F87171]' : 'text-[#6EE7B7]'
                                        }`}>
                                        {item.label.toUpperCase()}
                                    </span>

                                    {/* Confidence Bar */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-[#0D0D0D] rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${isFake
                                                    ? 'bg-gradient-to-r from-[#991B1B] to-[#F87171]'
                                                    : 'bg-gradient-to-r from-[#065F46] to-[#6EE7B7]'
                                                    }`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-[#888888] w-9 text-right">{pct}%</span>
                                    </div>

                                    {/* Date */}
                                    <span className="text-xs text-[#888888] text-right">{item.date}</span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default History
