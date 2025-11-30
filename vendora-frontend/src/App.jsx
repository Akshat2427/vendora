import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadUserFromToken } from './store/slices/userSlice'
import './App.css'
import RoundBallMenu from './components/RoundBallMenu/RoundBallMenu'
import Dashboard from './pages/Dashboard'
import Feedback from './pages/Feedback'
import Home from './pages/Home'
import Notification from './pages/Notification'
import AiChat from './pages/AiChat'
import Settings from './pages/Settings'
import AuctionDetails from './pages/AuctionDetails'
import PlaceBid from './pages/PlaceBid'
import AuctionCreate from './pages/AuctionCreate'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, loading } = useSelector((state) => state.user)

  // Load user from token on app mount
  useEffect(() => {
    dispatch(loadUserFromToken())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div>
        {isAuthenticated && (
          <div className="fixed bottom-4 left-4 z-50">
            <RoundBallMenu />
          </div>
        )}

        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login /> : <Navigate to="/home" replace />} 
          />
          <Route 
            path="/signup" 
            element={!isAuthenticated ? <Signup /> : <Navigate to="/home" replace />} 
          />
          
          {/* Protected routes */}
          <Route 
            path="/home" 
            element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/feedback" 
            element={isAuthenticated ? <Feedback /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/notification" 
            element={isAuthenticated ? <Notification /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/ai-chat" 
            element={isAuthenticated ? <AiChat /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/settings" 
            element={isAuthenticated ? <Settings /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/auction/:id/details" 
            element={isAuthenticated ? <AuctionDetails /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/auction/:id/bid" 
            element={isAuthenticated ? <PlaceBid /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/auction-create" 
            element={isAuthenticated ? <AuctionCreate /> : <Navigate to="/login" replace />} 
          />
          
          {/* Root redirect */}
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} 
          />
          
          {/* Fallback route */}
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
