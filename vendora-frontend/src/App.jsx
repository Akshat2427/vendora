import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './store/slices/userSlice'
import usersData from './data/users.json'
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

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, currentUser } = useSelector((state) => state.user)

  // Initialize default user on app mount
  useEffect(() => {
    if (!currentUser) {
      // Default to seller for now, you can change this
      const defaultUser = usersData.find((u) => u.role === 'seller')
      if (defaultUser) {
        dispatch(setUser(defaultUser))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  return (
    <BrowserRouter>
      <div>
        <div className="fixed bottom-4 left-4 z-50">
          <RoundBallMenu />
        </div>

        <Routes>
          {/* Home page doesn't require auth - it will initialize the user */}
          <Route 
            path="/home" 
            element={<Home />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/home" replace />} 
          />
          <Route 
            path="/feedback" 
            element={isAuthenticated ? <Feedback /> : <Navigate to="/home" replace />} 
          />
          <Route 
            path="/notification" 
            element={isAuthenticated ? <Notification /> : <Navigate to="/home" replace />} 
          />
          <Route 
            path="/ai-chat" 
            element={isAuthenticated ? <AiChat /> : <Navigate to="/home" replace />} 
          />
          <Route 
            path="/settings" 
            element={isAuthenticated ? <Settings /> : <Navigate to="/home" replace />} 
          />
          <Route 
            path="/auction/:id/details" 
            element={isAuthenticated ? <AuctionDetails /> : <Navigate to="/home" replace />} 
          />
          <Route 
            path="/auction/:id/bid" 
            element={isAuthenticated ? <PlaceBid /> : <Navigate to="/home" replace />} 
          />
          <Route 
            path="/auction-create" 
            element={isAuthenticated ? <AuctionCreate /> : <Navigate to="/home" replace />} 
          />
          <Route 
            path="/" 
            element={<Navigate to="/home" replace />} 
          />
          {/* Fallback route */}
          <Route 
            path="*" 
            element={<Navigate to="/home" replace />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
