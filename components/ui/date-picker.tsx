'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ChevronLeft, ChevronRight, Clock, Info, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DatePickerProps {
  selectedDate: Date | null
  onSelect: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  highlightDates?: { date: Date; label: string; color?: string }[]
  className?: string
}

// 農曆吉日（模擬資料）
const auspiciousDates = [
  { date: '2025-01-15', label: '宜祈福' },
  { date: '2025-01-18', label: '宜祈福' },
  { date: '2025-01-25', label: '大吉日' },
  { date: '2025-01-29', label: '除夕' },
  { date: '2025-01-30', label: '春節' },
  { date: '2025-02-03', label: '宜祈福' },
  { date: '2025-02-08', label: '宜點燈' },
  { date: '2025-02-12', label: '元宵節' },
  { date: '2025-02-15', label: '宜祈福' },
]

export function DatePicker({
  selectedDate,
  onSelect,
  minDate = new Date(),
  maxDate,
  highlightDates = [],
  className = '',
}: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showPicker, setShowPicker] = useState(false)

  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ]

  const dayNames = ['日', '一', '二', '三', '四', '五', '六']

  // 產生日曆資料
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    const startDayOfWeek = firstDay.getDay()
    const totalDays = lastDay.getDate()
    
    const days: (Date | null)[] = []
    
    // 填充前面的空白
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null)
    }
    
    // 填充日期
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }, [currentMonth])

  const formatDateStr = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (date < today) return true
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    
    return false
  }

  const isDateAuspicious = (date: Date) => {
    const dateStr = formatDateStr(date)
    return auspiciousDates.find(d => d.date === dateStr)
  }

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false
    return formatDateStr(date) === formatDateStr(selectedDate)
  }

  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleSelect = (date: Date) => {
    if (!isDateDisabled(date)) {
      onSelect(date)
      setShowPicker(false)
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* 觸發按鈕 */}
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:border-temple-gold-400 transition-colors bg-white"
      >
        <Calendar className="w-5 h-5 text-temple-gold-600" />
        <div className="flex-1 text-left">
          {selectedDate ? (
            <div>
              <div className="font-medium text-gray-900">
                {selectedDate.getFullYear()}/{selectedDate.getMonth() + 1}/{selectedDate.getDate()}
              </div>
              {isDateAuspicious(selectedDate) && (
                <div className="text-xs text-temple-red-600 flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {isDateAuspicious(selectedDate)?.label}
                </div>
              )}
            </div>
          ) : (
            <span className="text-gray-400">選擇點燈日期</span>
          )}
        </div>
        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showPicker ? 'rotate-90' : ''}`} />
      </button>

      {/* 日曆面板 */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4"
          >
            {/* 月份導航 */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={goToPrevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-gray-900">
                {currentMonth.getFullYear()} 年 {monthNames[currentMonth.getMonth()]}
              </h3>
              <button
                type="button"
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* 星期標題 */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day, i) => (
                <div
                  key={day}
                  className={`text-center text-xs font-medium py-2 ${
                    i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-500'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 日期格子 */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, i) => {
                if (!date) {
                  return <div key={`empty-${i}`} className="h-10" />
                }

                const disabled = isDateDisabled(date)
                const selected = isDateSelected(date)
                const auspicious = isDateAuspicious(date)
                const isToday = formatDateStr(date) === formatDateStr(new Date())

                return (
                  <button
                    key={formatDateStr(date)}
                    type="button"
                    onClick={() => handleSelect(date)}
                    disabled={disabled}
                    className={`
                      relative h-10 rounded-lg text-sm transition-all
                      ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-temple-gold-50 cursor-pointer'}
                      ${selected ? 'bg-temple-red-600 text-white hover:bg-temple-red-700' : ''}
                      ${isToday && !selected ? 'ring-2 ring-temple-gold-400' : ''}
                      ${auspicious && !selected ? 'bg-red-50 text-temple-red-700 font-medium' : ''}
                    `}
                  >
                    {date.getDate()}
                    {auspicious && !selected && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-temple-red-500 rounded-full" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* 圖例說明 */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-50 rounded" />
                  <span>吉日</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 ring-2 ring-temple-gold-400 rounded" />
                  <span>今天</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-temple-red-600 rounded" />
                  <span>已選</span>
                </div>
              </div>
            </div>

            {/* 吉日提示 */}
            <div className="mt-3 p-3 bg-temple-gold-50 rounded-lg">
              <div className="flex items-start gap-2 text-xs text-temple-gold-700">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>標示紅點的日期為農曆吉日，建議選擇吉日點燈祈福，效果更佳。</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 預約點燈時間選擇
interface TimeSlotPickerProps {
  selectedTime: string | null
  onSelect: (time: string) => void
  date: Date | null
  className?: string
}

export function TimeSlotPicker({
  selectedTime,
  onSelect,
  date,
  className = '',
}: TimeSlotPickerProps) {
  const timeSlots = [
    { time: '06:00', label: '卯時', description: '清晨祈福' },
    { time: '09:00', label: '巳時', description: '早課時段' },
    { time: '12:00', label: '午時', description: '正午吉時' },
    { time: '15:00', label: '申時', description: '下午時段' },
    { time: '18:00', label: '酉時', description: '晚課時段' },
  ]

  if (!date) {
    return (
      <div className={`p-4 bg-gray-50 rounded-lg text-center text-gray-500 ${className}`}>
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>請先選擇點燈日期</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-temple-gold-600" />
        <span className="text-sm font-medium text-gray-700">選擇點燈時辰</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {timeSlots.map((slot) => (
          <button
            key={slot.time}
            type="button"
            onClick={() => onSelect(slot.time)}
            className={`p-3 rounded-lg border-2 transition-all text-left ${
              selectedTime === slot.time
                ? 'border-temple-red-600 bg-temple-red-50'
                : 'border-gray-200 hover:border-temple-gold-300'
            }`}
          >
            <div className="font-bold text-gray-900">{slot.time}</div>
            <div className="text-sm text-temple-gold-600">{slot.label}</div>
            <div className="text-xs text-gray-500">{slot.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}




