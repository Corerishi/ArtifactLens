// frontend/src/pages/Home.jsx
import { useState, useRef, useCallback } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:8000'

function Home() {
    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [analyzing, setAnalyzing] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef(null)

    const handleFile = useCallback((file) => {
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file)
            setPreview(URL.createObjectURL(file))
            setResult(null)
            setError(null)
        }
    }, [])

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        handleFile(file)
    }, [handleFile])

    const handleDragOver = useCallback((e) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback(() => {
        setIsDragging(false)
    }, [])

    const handleBrowse = () => {
        fileInputRef.current?.click()
    }

    const handleFileInput = (e) => {
        const file = e.target.files[0]
        handleFile(file)
    }

    const handleAnalyze = async () => {
        if (!selectedFile) return
        setAnalyzing(true)
        setResult(null)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('file', selectedFile)

            const response = await axios.post(`${API_URL}/api/predict`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            const { label, confidence } = response.data

            // Handle "No face detected" from backend
            if (label === 'No face detected') {
                setError('No face detected in the uploaded image. Please try a different photo with a clearly visible face.')
                return
            }

            setResult({
                label: label.toUpperCase(),
                confidence: Math.round(confidence * 100 * 10) / 10,
            })
        } catch (err) {
            if (err.response) {
                // Server responded with an error status
                const msg = err.response.data?.detail || err.response.data?.message || 'Something went wrong on the server.'
                setError(msg)
            } else if (err.request) {
                // No response received — backend is offline
                setError('Cannot reach the server. Make sure the backend is running on localhost:8000.')
            } else {
                setError('An unexpected error occurred. Please try again.')
            }
        } finally {
            setAnalyzing(false)
        }
    }

    const handleReset = () => {
        setSelectedFile(null)
        setPreview(null)
        setResult(null)
        setError(null)
        setAnalyzing(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-[#E8E8E8] flex flex-col items-center relative animate-page-in">

            {/* Header / Title */}
            <header className="pt-24 mb-10 text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                    <span className="text-[#A78BFA]">
                        ArtifactLens
                    </span>
                </h1>
                <p className="mt-3 text-lg md:text-xl text-[#888888] font-light tracking-wide">
                    AI-Powered Deepfake Detection
                </p>
                <div className="mt-4 mx-auto h-[1px] w-24 bg-gradient-to-r from-transparent via-[#A78BFA]/40 to-transparent" />
            </header>

            {/* Main Card */}
            <main className="w-full max-w-2xl px-4">
                <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#2A2A2A] animate-card-in">

                    {/* Upload Zone */}
                    {!preview ? (
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={handleBrowse}
                            className={`
                relative cursor-pointer rounded-xl border-2 border-dashed p-12
                flex flex-col items-center justify-center gap-4 transition-all duration-300
                ${isDragging
                                    ? 'border-[#A78BFA] bg-[#A78BFA]/5 shadow-[0_0_30px_rgba(167,139,250,0.1)]'
                                    : 'border-[#2A2A2A] hover:border-[#A78BFA]/40 hover:bg-[#141414] animate-pulse-glow'
                                }
              `}
                        >
                            {/* Upload Icon */}
                            <div className={`transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
                                <svg className="w-14 h-14 text-[#A78BFA]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <p className="text-[#E8E8E8] text-base font-medium">
                                Drag & drop an image here
                            </p>
                            <p className="text-[#888888] text-sm">or</p>
                            <button
                                type="button"
                                className="px-5 py-2 rounded-lg bg-[#A78BFA]/10 border border-[#A78BFA]/25 text-[#A78BFA] text-sm font-semibold
                           hover:bg-[#A78BFA]/20 hover:border-[#A78BFA]/40 transition-all duration-200"
                            >
                                Browse File
                            </button>
                            <p className="text-[#888888] text-xs mt-1">Supports JPG, PNG, WEBP</p>
                        </div>
                    ) : (
                        /* Image Preview */
                        <div className="flex flex-col items-center gap-5 animate-pop-in">
                            <div className="relative group">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="max-h-72 rounded-xl object-contain border border-[#2A2A2A]"
                                />
                            </div>
                            <p className="text-sm text-[#888888] truncate max-w-xs">
                                📄 {selectedFile?.name}
                            </p>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                    />

                    {/* Action Buttons */}
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <button
                            onClick={handleAnalyze}
                            disabled={!selectedFile || analyzing}
                            className={`
                relative px-8 py-3 rounded-xl font-bold text-sm tracking-wide uppercase transition-all duration-300
                ${selectedFile && !analyzing
                                    ? 'bg-[#A78BFA] text-[#0D0D0D] shadow-[0_0_20px_rgba(167,139,250,0.15)] hover:bg-[#8B5CF6] hover:shadow-[0_0_30px_rgba(167,139,250,0.25)] hover:scale-[1.02] active:scale-[0.98]'
                                    : 'bg-[#1A1A1A] text-[#555] cursor-not-allowed border border-[#2A2A2A]'
                                }
              `}
                        >
                            {analyzing ? (
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Analyzing...
                                </span>
                            ) : (
                                '🔍 Analyze'
                            )}
                        </button>

                        {preview && (
                            <button
                                onClick={handleReset}
                                className="px-5 py-3 rounded-xl font-semibold text-sm text-[#888888] border border-[#2A2A2A]
                           hover:text-[#E8E8E8] hover:border-[#444] hover:bg-[#141414] transition-all duration-200"
                            >
                                Reset
                            </button>
                        )}
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mt-8 p-5 rounded-xl bg-[#2D1515]/60 border border-[#F87171]/15 animate-pop-in">
                            <div className="flex items-start gap-3">
                                <span className="text-[#F87171] text-xl mt-0.5">⚠️</span>
                                <div>
                                    <p className="text-[#F87171] font-semibold text-sm">Analysis Failed</p>
                                    <p className="text-[#888888] text-sm mt-1">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Result Display */}
                    {result && (
                        <div className={`mt-8 p-6 rounded-xl border animate-pop-in ${result.label === 'FAKE'
                                ? 'bg-[#2D1515] border-[#F87171]/20'
                                : 'bg-[#0F2D1A] border-[#6EE7B7]/20'
                            }`}>
                            <p className="text-center text-sm text-[#888888] uppercase tracking-widest mb-3">
                                Detection Result
                            </p>
                            <p className={`text-center text-5xl font-black tracking-wider ${result.label === 'FAKE'
                                    ? 'text-[#F87171]'
                                    : 'text-[#6EE7B7]'
                                }`}>
                                {result.label}
                            </p>

                            {/* Confidence Bar */}
                            <div className="mt-5">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-[#888888]">Confidence</span>
                                    <span className={`font-bold ${result.label === 'FAKE' ? 'text-[#F87171]' : 'text-[#6EE7B7]'
                                        }`}>
                                        {result.confidence}%
                                    </span>
                                </div>
                                <div className="w-full h-3 bg-[#0D0D0D] rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${result.label === 'FAKE'
                                                ? 'bg-gradient-to-r from-[#991B1B] to-[#F87171]'
                                                : 'bg-gradient-to-r from-[#065F46] to-[#6EE7B7]'
                                            }`}
                                        style={{ width: `${result.confidence}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-[#555] text-xs mt-8 mb-6">
                    Built with 🧠 AI · ArtifactLens v1.0
                </p>
            </main>
        </div>
    )
}

export default Home
