// frontend/src/pages/Login.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [googleMsg, setGoogleMsg] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const res = await axios.post('http://localhost:8000/api/auth/login', {
                email: form.email,
                password: form.password,
            })
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('userName', res.data.name)
            localStorage.setItem('userEmail', res.data.email)
            navigate('/')
        } catch (err) {
            if (err.response) {
                setError(err.response.data?.detail || 'Invalid email or password')
            } else {
                setError('Cannot reach server')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleClick = () => {
        setGoogleMsg(true)
        setTimeout(() => setGoogleMsg(false), 3000)
    }

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-[#E8E8E8] flex items-center justify-center animate-page-in">
            <div className="w-full max-w-md px-4">
                {/* Logo */}
                <Link to="/" className="block text-center mb-8 group">
                    <h1 className="text-3xl font-extrabold tracking-tight">
                        <span className="text-[#A78BFA]">
                            ArtifactLens
                        </span>
                    </h1>
                </Link>

                {/* Card */}
                <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#2A2A2A] animate-card-in">
                    <h2 className="text-2xl font-bold text-center mb-1 text-[#E8E8E8]">Welcome Back</h2>
                    <p className="text-[#888888] text-sm text-center mb-6">Sign in to your account</p>

                    {/* Google Sign-In Button */}
                    <div className="relative mb-5">
                        <button
                            type="button"
                            onClick={handleGoogleClick}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl
                               bg-[#141414] hover:bg-[#1E1E1E] text-[#E8E8E8] font-medium text-sm
                               border border-[#333] shadow-sm
                               hover:border-[#444] hover:scale-[1.01] active:scale-[0.99]
                               transition-all duration-200 cursor-pointer"
                        >
                            <svg width="18" height="18" viewBox="0 0 48 48">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            </svg>
                            Continue with Google
                        </button>

                        {/* Tooltip message */}
                        <div
                            className={`absolute left-1/2 -translate-x-1/2 mt-2 px-4 py-2 rounded-lg
                                bg-[#2A2A2A] border border-[#333] text-[#E8E8E8] text-xs text-center
                                shadow-lg whitespace-nowrap
                                transition-all duration-300 pointer-events-none z-10
                                ${googleMsg ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}
                        >
                            Google Sign-In will be available after deployment
                        </div>
                    </div>

                    {/* OR Divider */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1 h-px bg-[#2A2A2A]" />
                        <span className="text-xs text-[#888888] font-medium uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-[#2A2A2A]" />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-5 p-3 rounded-xl bg-[#2D1515] border border-[#F87171]/20 text-[#F87171] text-sm text-center animate-pop-in">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-[#E8E8E8] mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-[#333]
                         text-[#E8E8E8] placeholder-[#555] text-sm
                         focus:outline-none focus:border-[#A78BFA]/50 focus:ring-1 focus:ring-[#A78BFA]/30
                         transition-all duration-200"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-[#E8E8E8] mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-[#333]
                         text-[#E8E8E8] placeholder-[#555] text-sm
                         focus:outline-none focus:border-[#A78BFA]/50 focus:ring-1 focus:ring-[#A78BFA]/30
                         transition-all duration-200"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl font-bold text-sm tracking-wide uppercase
                       bg-[#A78BFA] text-[#0D0D0D]
                       hover:bg-[#8B5CF6] hover:shadow-[0_0_20px_rgba(167,139,250,0.2)] hover:scale-[1.02]
                       active:scale-[0.98] transition-all duration-300
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Link to Register */}
                    <p className="mt-6 text-center text-sm text-[#888888]">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="text-[#A78BFA] font-semibold hover:text-[#8B5CF6] transition-colors">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
