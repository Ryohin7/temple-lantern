'use client'

import { useState, useEffect } from 'react'
import { Calendar, Info } from 'lucide-react'
import { Input } from './input'
import { Label } from './label'
import { formatLunarDate, getLunarInfo, toMinguo, calculateAge } from '@/lib/lunar-calendar'

interface BirthdayInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  required?: boolean
  showLunar?: boolean
  showMinguo?: boolean
  showAge?: boolean
  className?: string
}

export function BirthdayInput({
  value,
  onChange,
  label = '出生日期',
  required = false,
  showLunar = true,
  showMinguo = true,
  showAge = true,
  className = '',
}: BirthdayInputProps) {
  const [lunarDate, setLunarDate] = useState('')
  const [minguoDate, setMinguoDate] = useState('')
  const [age, setAge] = useState<number | null>(null)
  const [shengXiao, setShengXiao] = useState('')

  useEffect(() => {
    if (value) {
      const lunar = getLunarInfo(value)
      setLunarDate(lunar.formatted)
      setShengXiao(lunar.shengXiao)
      setMinguoDate(toMinguo(value))
      setAge(calculateAge(value))
    } else {
      setLunarDate('')
      setMinguoDate('')
      setAge(null)
      setShengXiao('')
    }
  }, [value])

  return (
    <div className={className}>
      <Label htmlFor="birthday" className="flex items-center gap-1">
        <Calendar className="w-4 h-4" />
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="mt-1 space-y-2">
        <Input
          id="birthday"
          type="date"
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
        />
        
        {value && (showLunar || showMinguo || showAge) && (
          <div className="p-3 bg-temple-gold-50 rounded-lg border border-temple-gold-200 space-y-1">
            {showMinguo && minguoDate && (
              <div className="text-sm text-gray-700">
                📅 {minguoDate}
              </div>
            )}
            {showLunar && lunarDate && (
              <div className="text-sm text-temple-red-700 font-medium">
                🌙 {lunarDate}
              </div>
            )}
            {shengXiao && (
              <div className="text-sm text-gray-600">
                🐲 生肖：{shengXiao}
              </div>
            )}
            {showAge && age !== null && (
              <div className="text-sm text-gray-600">
                👤 年齡：{age} 歲
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}






