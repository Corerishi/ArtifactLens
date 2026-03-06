import { Link, useLocation, useNavigate } from 'react-router-dom'

function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const userName = localStorage.getItem('userName')

    const links = [
        { to: '/', label: 'Home' },
        { to: '/history', label: 'History' },
    ]

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userName')
        localStorage.removeItem('userEmail')
        navigate('/login')
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#111111] border-b border-[#2A2A2A]">
            <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <span className="text-xl font-extrabold tracking-tight text-[#A78BFA]">
                        ArtifactLens
                    </span>
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-1">
                    {links.map(({ to, label }) => {
                        const isActive = location.pathname === to
                        return (
                            <Link
                                key={to}
                                to={to}
                                className={`
                                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                    ${isActive
                                        ? 'text-[#A78BFA] bg-[#A78BFA]/10'
                                        : 'text-[#888888] hover:text-[#E8E8E8] hover:bg-[#1A1A1A]'
                                    }
                                `}
                            >
                                {label}
                            </Link>
                        )
                    })}

                    {token ? (
                        <div className="flex items-center gap-3 ml-3">
                            <span className="text-sm text-[#888888]">
                                👋 <span className="text-[#E8E8E8] font-medium">{userName}</span>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2 rounded-lg text-sm font-semibold
                                           text-[#888888] border border-[#2A2A2A]
                                           hover:text-[#F87171] hover:border-[#F87171]/30 hover:bg-[#2D1515]/40
                                           active:scale-[0.98] transition-all duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="ml-3 px-5 py-2 rounded-lg text-sm font-semibold
                                       bg-[#A78BFA] text-[#0D0D0D]
                                       hover:bg-[#8B5CF6] hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(167,139,250,0.2)]
                                       active:scale-[0.98] transition-all duration-200"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
