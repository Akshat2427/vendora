import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function MiniRoundMenuBall({ icon, path, index, isVisible, angle, radius, mainBallCenterX, mainBallCenterY }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (path) {
      navigate(path)
    }
  }
  // Calculate position based on angle and radius
  // 0° = right, 90° = down, 180° = left, 270° = up (CSS coordinate system)
  const radians = (angle * Math.PI) / 180
  const x = Math.cos(radians) * radius
  const y = Math.sin(radians) * radius

  // When visible, start from the main ball's center and animate outward
  // The mini ball is 32px (w-8 h-8), so we need to offset by -16px to center it
  const miniBallSize = 32 // w-8 h-8 = 32px
  const centerOffset = -miniBallSize / 2 // -16px to center the 32px ball
  
  // Calculate final position relative to main ball center
  const finalX = mainBallCenterX + x
  const finalY = mainBallCenterY + y
  
  return (
    <motion.div
      key={`ball-${index}-${mainBallCenterX}-${mainBallCenterY}`}
      className="absolute"
      style={{
        left: 0,
        top: 0
      }}
      initial={{
        x: mainBallCenterX + centerOffset,
        y: mainBallCenterY + centerOffset,
        scale: 0,
        opacity: 0,
      }}
      animate={{
        x: isVisible ? finalX + centerOffset : mainBallCenterX + centerOffset,
        y: isVisible ? finalY + centerOffset : mainBallCenterY + centerOffset,
        scale: isVisible ? 1 : 0,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        duration: 0.6,
        delay: isVisible ? 0.2 + (index * 0.01) : 0,
        ease: "easeOut"
      }}
    >
      <div 
        className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
        onClick={handleClick}
      >
        <span className="text-lg text-gray-700">
          {icon}
        </span>
      </div>
    </motion.div>
  )
}

