'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, User, Menu, X, Flame, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore, useUserStore } from '@/lib/store'
import { Lantern } from '../temple/Lantern'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const itemCount = useCartStore(state => state.getItemCount())
  const user = useUserStore(state => state.user)

  useEffect(() => {
    setMounted(true)
    useCartStore.persist.rehydrate()
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-temple-gold-300 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Lantern size="sm" animate />
            </div>
            <div>
              <h1 className="text-2xl font-temple font-bold text-temple-red-700 group-hover:text-temple-red-600 transition-colors">
                台灣點燈網
              </h1>
              <p className="text-xs text-temple-gold-600">線上祈福點燈平台</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/search" 
              className="text-gray-700 hover:text-temple-red-600 font-medium transition-colors flex items-center gap-1"
            >
              <Search className="w-4 h-4" />
              搜尋
            </Link>
            <Link 
              href="/temples" 
              className="text-gray-700 hover:text-temple-red-600 font-medium transition-colors flex items-center gap-1"
            >
              <Flame className="w-4 h-4" />
              廟宇列表
            </Link>
            <Link 
              href="/blessings" 
              className="text-gray-700 hover:text-temple-red-600 font-medium transition-colors"
            >
              祈福留言
            </Link>
            <Link 
              href="/how-it-works" 
              className="text-gray-700 hover:text-temple-red-600 font-medium transition-colors"
            >
              如何點燈
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link href="/cart">
              <Button variant="outline" size="icon" className="relative border-temple-gold-300 hover:bg-temple-gold-50">
                <ShoppingCart className="w-5 h-5 text-temple-red-600" />
                {mounted && itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-temple-red-600 text-white rounded-full text-xs flex items-center justify-center font-bold"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </Button>
            </Link>

            {/* User */}
            {user ? (
              <Link href="/dashboard">
                <Button variant="outline" className="hidden md:flex border-temple-gold-300 hover:bg-temple-gold-50">
                  <User className="w-4 h-4 mr-2" />
                  {user.name || '會員中心'}
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="temple" className="hidden md:flex">
                  <User className="w-4 h-4 mr-2" />
                  登入/註冊
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden border-t border-temple-gold-200 bg-white"
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link 
              href="/temples" 
              className="text-gray-700 hover:text-temple-red-600 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              🏮 廟宇列表
            </Link>
            <Link 
              href="/blessings" 
              className="text-gray-700 hover:text-temple-red-600 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              🙏 祈福留言
            </Link>
            <Link 
              href="/how-it-works" 
              className="text-gray-700 hover:text-temple-red-600 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              ✨ 如何點燈
            </Link>
            <div className="pt-4 border-t border-temple-gold-200">
              {user ? (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="temple" className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    {user.name || '會員中心'}
                  </Button>
                </Link>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="temple" className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    登入/註冊
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  )
}


