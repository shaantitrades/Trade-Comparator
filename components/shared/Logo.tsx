'use client'

import { motion } from 'framer-motion'

interface LogoProps {
  className?: string
  size?: number
}

export function Logo({ className = '', size = 48 }: LogoProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <defs>
        {/* Gradient doré pour la balance */}
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
          <stop offset="50%" stopColor="#FFA500" stopOpacity="1" />
          <stop offset="100%" stopColor="#DAA520" stopOpacity="1" />
        </linearGradient>
        
        {/* Ombre */}
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="1" dy="2" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Ombre sous la base */}
      <ellipse
        cx="60"
        cy="115"
        rx="25"
        ry="5"
        fill="#808080"
        opacity="0.4"
      />

      {/* Colonne centrale */}
      <motion.path
        d="M 55 100
           L 55 20
           L 65 20
           L 65 100
           Z
           M 50 100
           L 50 95
           L 70 95
           L 70 100
           Z
           M 58 20
           L 58 15
           L 62 15
           L 62 20
           Z
           M 60 15
           L 60 10
           L 58 10
           L 60 8
           L 62 10
           L 60 10
           Z"
        fill="url(#goldGradient)"
        filter="url(#shadow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Barre horizontale (beam) */}
      <motion.path
        d="M 20 25
           Q 20 20, 25 20
           L 55 20
           L 65 20
           L 95 20
           Q 100 20, 100 25
           Q 100 30, 95 30
           L 65 30
           L 55 30
           L 25 30
           Q 20 30, 20 25
           Z"
        fill="url(#goldGradient)"
        filter="url(#shadow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
      />

      {/* Chaînes et plateaux - Côté gauche */}
      <motion.g
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {/* Chaînes gauche */}
        <line x1="25" y1="25" x2="25" y2="40" stroke="url(#goldGradient)" strokeWidth="1.5" filter="url(#shadow)" />
        <line x1="30" y1="25" x2="30" y2="40" stroke="url(#goldGradient)" strokeWidth="1.5" filter="url(#shadow)" />
        <line x1="35" y1="25" x2="35" y2="40" stroke="url(#goldGradient)" strokeWidth="1.5" filter="url(#shadow)" />
        
        {/* Plateau gauche */}
        <ellipse
          cx="30"
          cy="45"
          rx="12"
          ry="3"
          fill="url(#goldGradient)"
          filter="url(#shadow)"
        />
        <path
          d="M 18 45
             Q 18 50, 30 55
             Q 42 50, 42 45
             Q 42 40, 30 45
             Q 18 40, 18 45
             Z"
          fill="url(#goldGradient)"
          filter="url(#shadow)"
        />
      </motion.g>

      {/* Chaînes et plateaux - Côté droit */}
      <motion.g
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {/* Chaînes droite */}
        <line x1="85" y1="25" x2="85" y2="40" stroke="url(#goldGradient)" strokeWidth="1.5" filter="url(#shadow)" />
        <line x1="90" y1="25" x2="90" y2="40" stroke="url(#goldGradient)" strokeWidth="1.5" filter="url(#shadow)" />
        <line x1="95" y1="25" x2="95" y2="40" stroke="url(#goldGradient)" strokeWidth="1.5" filter="url(#shadow)" />
        
        {/* Plateau droit */}
        <ellipse
          cx="90"
          cy="45"
          rx="12"
          ry="3"
          fill="url(#goldGradient)"
          filter="url(#shadow)"
        />
        <path
          d="M 78 45
             Q 78 50, 90 55
             Q 102 50, 102 45
             Q 102 40, 90 45
             Q 78 40, 78 45
             Z"
          fill="url(#goldGradient)"
          filter="url(#shadow)"
        />
      </motion.g>
    </motion.svg>
  )
}
