import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Dashboard from './pages/Dashboard'
import MovieDetail from './pages/MovieDetail'
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'
import Profile from './pages/Profile'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Routes protégées : redirigent vers /login si non authentifié */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </>
  )
}
