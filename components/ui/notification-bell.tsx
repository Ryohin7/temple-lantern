'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Check, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  formatNotificationTime,
  getNotificationIcon,
  type Notification
} from '@/lib/notification'

interface NotificationBellProps {
  className?: string
}

export function NotificationBell({ className = '' }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.isRead).length

  useEffect(() => {
    setMounted(true)
    fetchNotifications()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const markAsRead = async (id: string, link?: string) => {
    // 樂觀更新 UI
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ))

    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id, isRead: true })
      })
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      // 如果失敗，可以選擇回滾狀態，這裡暫時忽略
    }
  }

  const markAllAsRead = async () => {
    // 樂觀更新 UI
    setNotifications(notifications.map(n => ({ ...n, isRead: true })))

    // 逐個更新（理想情況下後端應該提供批量更新 API）
    // 這裡為了簡化，實際上可能不會真的發送所有請求，或者只發送未讀的
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id)

    // 如果未讀數量不多，可以並行請求，否則應該有批量 API
    // 由於我們沒有批量 API，這裡只對前幾個進行處理，或者暫時不實現後端同步
    // TODO: 實現批量標記已讀 API

    try {
      await Promise.all(unreadIds.map(id =>
        fetch('/api/notifications', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notificationId: id, isRead: true })
        })
      ))
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const deleteNotification = async (id: string) => {
    // 樂觀更新 UI
    setNotifications(notifications.filter(n => n.id !== id))

    try {
      await fetch(`/api/notifications?id=${id}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Failed to delete notification:', error)
      // 如果失敗，回滾
      fetchNotifications()
    }
  }

  if (!mounted) return null

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* 鈴鐺按鈕 */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-temple-red-600 text-white rounded-full text-xs flex items-center justify-center font-bold"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </Button>

      {/* 下拉選單 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-900">通知</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-temple-red-600 hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="w-3 h-3" />
                  全部已讀
                </button>
              )}
            </div>

            {/* 通知列表 */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>暫無通知</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`relative p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-temple-gold-50' : ''
                      }`}
                  >
                    <Link
                      href={notification.link || '#'}
                      onClick={() => markAsRead(notification.id)}
                      className="block"
                    >
                      <div className="flex gap-3">
                        <span className="text-2xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`font-medium text-sm ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'
                              }`}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-temple-red-600 rounded-full flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatNotificationTime(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Link>

                    {/* 刪除按鈕 */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        deleteNotification(notification.id)
                      }}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <Link href="/dashboard/notifications">
                <Button variant="ghost" className="w-full text-sm text-gray-600 hover:text-temple-red-600">
                  查看所有通知
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}





