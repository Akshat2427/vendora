import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MdDashboard, 
  MdFeedback, 
  MdHome, 
  MdNotifications, 
  MdHistory, 
  MdSettings 
} from 'react-icons/md'
import MiniRoundMenuBall from '../MiniRoundMenuBall/MiniRoundMenuBall'

// Icons and paths for the 6 menu items
const menuItems = [
  { icon: <MdDashboard key="dashboard" />, path: '/dashboard' },      // 1. dashboard
  { icon: <MdFeedback key="feedback" />, path: '/feedback' },           // 2. feedback
  { icon: <MdHome key="home" />, path: '/home' },                 // 3. Home
  { icon: <MdNotifications key="notification" />, path: '/notification' }, // 4. notification
  { icon: <MdHistory key="history" />, path: '/history' },           // 5. history
  { icon: <MdSettings key="settings" />, path: '/settings' }          // 6. settings
]

export default function RoundBallMenu() {
  const [isHovered, setIsHovered] = useState(false)

  // Create 6 mini balls positioned evenly around the main ball in a circle
  // 360° / 6 = 60° apart
  const miniBalls = Array.from({ length: 6 }, (_, index) => {
    // Distribute evenly around the circle (60° apart)
    // Starting at 0° (right), then 60°, 120°, 180°, 240°, 300°
    const angle = index * 60
    // Equal radius for all balls to form a perfect circle
    const radius = 75
    return {
      icon: menuItems[index].icon,
      path: menuItems[index].path,
      angle,
      radius,
      index,
    }
  })

  return (
    <div 
      className="relative"
      style={{ 
        width: '300px', 
        height: '300px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main round ball - moves toward top right on hover (1 second animation) */}
      <motion.div 
        className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden relative z-10"
        style={{
          position: 'absolute',
          bottom: '0',
          left: '0'
        }}
        animate={{
          x: isHovered ? 50 : 0,
          y: isHovered ? -50 : 0,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut"
        }}
      >
        <img
          src="/vendora_logo.png"
          alt="Vendora Logo"
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Mini balls positioned evenly around the main ball in a circle */}
      {miniBalls.map((ball) => {
        // Calculate the main ball's center position
        // Main ball is 64px (w-16 h-16), positioned at bottom: 0, left: 0
        // When hovered, it moves 50px right and -50px up
        const mainBallCenterX = 32 + (isHovered ? 50 : 0) // 32px (half of 64px) + offset
        const mainBallCenterY = 300 - 32 + (isHovered ? -50 : 0) // 300px (container height) - 32px (half of 64px) + offset
        
        return (
          <MiniRoundMenuBall
            key={ball.index}
            icon={ball.icon}
            path={ball.path}
            index={ball.index}
            isVisible={isHovered}
            angle={ball.angle}
            radius={ball.radius}
            mainBallCenterX={mainBallCenterX}
            mainBallCenterY={mainBallCenterY}
          />
        )
      })}
    </div>
  )
}
