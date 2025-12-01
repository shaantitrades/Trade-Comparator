'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Platform {
  id: string
  name: string
  rating: number
  minDeposit: number
  spread: string
  leverage: string
  regulations: string[]
  platform: string[]
}

interface ComparisonTableProps {
  platforms: Platform[]
  columns: string[]
}

export function ComparisonTable({ platforms, columns }: ComparisonTableProps) {
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDirection('asc')
    }
  }

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <div className="min-w-full inline-block">
        <table className="w-full border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-4 font-semibold">Plateforme</th>
            {columns.map((column) => (
              <th
                key={column}
                className="text-left p-2 sm:p-3 md:p-4 font-semibold cursor-pointer hover:bg-accent/50 transition-colors text-xs sm:text-sm"
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center space-x-2">
                  <span>{column}</span>
                  {sortBy === column && (
                    sortDirection === 'asc' ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {platforms.map((platform, index) => (
            <motion.tr
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border-b border-border hover:bg-accent/30 transition-colors cursor-pointer"
              onClick={() => toggleRow(platform.id)}
            >
              <td className="p-2 sm:p-3 md:p-4">
                <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap">
                  <span className="font-semibold text-xs sm:text-sm">{platform.name}</span>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'w-3 h-3',
                          i < Math.round(platform.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-400'
                        )}
                      />
                    ))}
                  </div>
                </div>
              </td>
              <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm">{platform.minDeposit}€</td>
              <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm">{platform.spread}</td>
              <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm">{platform.leverage}</td>
              <td className="p-2 sm:p-3 md:p-4">
                <div className="flex flex-wrap gap-1">
                  {platform.regulations.map((reg) => (
                    <span key={reg} className="text-xs px-2 py-1 bg-primary/20 rounded">
                      {reg}
                    </span>
                  ))}
                </div>
              </td>
              <td className="p-4">
                <div className="flex flex-wrap gap-1">
                  {platform.platform.map((p) => (
                    <span key={p} className="text-xs px-2 py-1 bg-secondary rounded">
                      {p}
                    </span>
                  ))}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}




