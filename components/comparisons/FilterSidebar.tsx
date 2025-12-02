'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Filter {
  id: string
  label: string
  type: 'checkbox' | 'range' | 'select'
  options?: string[]
  min?: number
  max?: number
}

interface FilterSidebarProps {
  filters: Filter[]
  onFilterChange: (filters: Record<string, any>) => void
  className?: string
}

export function FilterSidebar({ filters, onFilterChange, className }: FilterSidebarProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({})
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(new Set(filters.map((f) => f.id)))

  const toggleFilter = (filterId: string) => {
    const newExpanded = new Set(expandedFilters)
    if (newExpanded.has(filterId)) {
      newExpanded.delete(filterId)
    } else {
      newExpanded.add(filterId)
    }
    setExpandedFilters(newExpanded)
  }

  const updateFilter = (filterId: string, value: any) => {
    const newFilters = { ...selectedFilters, [filterId]: value }
    setSelectedFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    setSelectedFilters({})
    onFilterChange({})
  }

  const activeFiltersCount = Object.keys(selectedFilters).length

  return (
    <div className={cn('glass rounded-lg p-6 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filtres</h3>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
          >
            <X className="w-4 h-4 mr-1" />
            Réinitialiser ({activeFiltersCount})
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {filters.map((filter) => (
          <div key={filter.id} className="border-b border-border/50 pb-2">
            <button
              onClick={() => toggleFilter(filter.id)}
              className="w-full flex items-center justify-between py-2 text-sm font-medium"
            >
              <span>{filter.label}</span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 transition-transform',
                  expandedFilters.has(filter.id) && 'rotate-180'
                )}
              />
            </button>

            <AnimatePresence>
              {expandedFilters.has(filter.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="py-2 space-y-2">
                    {filter.type === 'checkbox' && filter.options && (
                      <div className="space-y-2">
                        {filter.options.map((option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-2 text-sm cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedFilters[filter.id]?.includes(option) || false}
                              onChange={(e) => {
                                const current = selectedFilters[filter.id] || []
                                const newValue = e.target.checked
                                  ? [...current, option]
                                  : current.filter((v: string) => v !== option)
                                updateFilter(filter.id, newValue)
                              }}
                              className="rounded border-border"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {filter.type === 'range' && filter.min !== undefined && filter.max !== undefined && (
                      <div className="space-y-2">
                        <input
                          type="range"
                          min={filter.min}
                          max={filter.max}
                          value={selectedFilters[filter.id] || filter.min}
                          onChange={(e) => updateFilter(filter.id, Number(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{filter.min}€</span>
                          <span className="font-semibold">
                            {selectedFilters[filter.id] || filter.min}€
                          </span>
                          <span>{filter.max}€</span>
                        </div>
                      </div>
                    )}

                    {filter.type === 'select' && filter.options && (
                      <select
                        value={selectedFilters[filter.id] || ''}
                        onChange={(e) => updateFilter(filter.id, e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Tous</option>
                        {filter.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}






