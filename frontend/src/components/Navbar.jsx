import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-marquee/20 bg-ink/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="font-display text-2xl tracking-wide text-marquee-light">
          CINÉ<span className="text-cream">MATCH</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link to="/" className="text-muted transition hover:text-cream">
            Films
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-muted transition hover:text-cream">
                {user?.name || user?.email || 'Profil'}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full border border-marquee/40 px-4 py-1.5 font-medium text-marquee-light transition hover:bg-marquee hover:text-ink"
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-marquee px-4 py-1.5 font-semibold text-ink transition hover:bg-marquee-light"
            >
              Se connecter
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}