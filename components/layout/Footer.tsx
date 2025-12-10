'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Flame, Mail, Phone, MapPin } from 'lucide-react'
import { Lantern } from '../temple/Lantern'

export function Footer() {
  return (
    <footer className="bg-temple-dark text-white mt-20">
      {/* 裝飾性燈籠 */}
      <div className="relative h-16">
        <div className="absolute top-0 left-0 right-0 flex justify-around items-start">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Lantern size="sm" color={i % 2 === 0 ? 'red' : 'gold'} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌資訊 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-temple-gold-400" />
              <h3 className="text-xl font-temple font-bold text-temple-gold-400">
                台灣點燈網
              </h3>
            </div>
            <p className="text-gray-300 text-sm">
              連結傳統與現代，讓祈福更簡單。線上點燈，心誠則靈。
            </p>
            <div className="flex gap-4 text-2xl">
              <span>🏮</span>
              <span>🙏</span>
              <span>✨</span>
            </div>
          </div>

          {/* 快速連結 */}
          <div>
            <h4 className="font-temple font-bold text-temple-gold-400 mb-4">
              快速連結
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/temples" className="text-gray-300 hover:text-temple-gold-400 transition-colors">
                  廟宇列表
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 hover:text-temple-gold-400 transition-colors">
                  法會活動
                </Link>
              </li>
              <li>
                <Link href="/blessings" className="text-gray-300 hover:text-temple-gold-400 transition-colors">
                  祈福留言
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-300 hover:text-temple-gold-400 transition-colors">
                  如何點燈
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-temple-gold-400 transition-colors">
                  常見問題
                </Link>
              </li>
            </ul>
          </div>

          {/* 廟宇管理 */}
          <div>
            <h4 className="font-temple font-bold text-temple-gold-400 mb-4">
              廟宇管理
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/temple-admin/register" className="text-gray-300 hover:text-temple-gold-400 transition-colors">
                  廟宇註冊
                </Link>
              </li>
              <li>
                <Link href="/temple-admin/login" className="text-gray-300 hover:text-temple-gold-400 transition-colors">
                  管理後台
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-temple-gold-400 transition-colors">
                  合作洽詢
                </Link>
              </li>
            </ul>
          </div>

          {/* 聯絡資訊 */}
          <div>
            <h4 className="font-temple font-bold text-temple-gold-400 mb-4">
              聯絡我們
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-temple-gold-400" />
                <a href="mailto:contact@temple-lantern.tw" className="hover:text-temple-gold-400 transition-colors">
                  contact@temple-lantern.tw
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-temple-gold-400" />
                <a href="tel:+886-2-1234-5678" className="hover:text-temple-gold-400 transition-colors">
                  02-1234-5678
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-temple-gold-400 mt-1 flex-shrink-0" />
                <span>台北市中山區民權東路123號</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 分隔線 */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-temple-gold-400 to-transparent opacity-30" />

        {/* 版權資訊 */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} 台灣點燈網. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-temple-gold-400 transition-colors">
              隱私權政策
            </Link>
            <Link href="/terms" className="hover:text-temple-gold-400 transition-colors">
              服務條款
            </Link>
          </div>
        </div>
      </div>

      {/* 底部裝飾 */}
      <div className="h-2 bg-temple-gradient" />
    </footer>
  )
}


