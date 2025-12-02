'use client'

import { Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

const regulationColors: Record<string, string> = {
  FCA: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  CySEC: 'bg-green-500/20 text-green-400 border-green-500/30',
  ASIC: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  BaFin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  FINMA: 'bg-red-500/20 text-red-400 border-red-500/30',
}

interface RegulationBadgeProps {
  regulation: string
  className?: string
}

export function RegulationBadge({ regulation, className }: RegulationBadgeProps) {
  const colorClass = regulationColors[regulation] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'

  return (
    <div
      className={cn(
        'inline-flex items-center space-x-1 px-2 py-1 rounded-md border text-xs font-medium',
        colorClass,
        className
      )}
    >
      <Shield className="w-3 h-3" />
      <span>{regulation}</span>
    </div>
  )
}








