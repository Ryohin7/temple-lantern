'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
    LayoutDashboard,
    Users,
    Building2,
    ShoppingBag,
    Calendar,
    FileText,
    Image,
    DollarSign,
    Settings,
    LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Lantern } from '@/components/temple/Lantern'

interface AdminLayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const { getCurrentUser } = await import('@/lib/auth')
            const currentUser = await getCurrentUser()

            if (!currentUser) {
                router.push('/admin/login')
                return
            }

            if (currentUser.role !== 'admin') {
                router.push('/')
                return
            }

            setUser(currentUser)
            setLoading(false)
        } catch (error) {
            console.error('Auth check failed:', error)
            router.push('/admin/login')
        }
    }

    const handleLogout = async () => {
        const { signOut } = await import('@/lib/auth')
        await signOut()
        router.push('/')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-4xl animate-bounce">🏮</div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    const navItems = [
        { icon: LayoutDashboard, label: '儀表板', href: '/admin/dashboard' },
        { icon: Building2, label: '廟宇管理', href: '/admin/temples' },
        { icon: Users, label: '用戶管理', href: '/admin/users' },
        { icon: ShoppingBag, label: '訂單管理', href: '/admin/orders' },
        { icon: Calendar, label: '活動管理', href: '/admin/events' },
        { icon: FileText, label: '內容管理', href: '/admin/content' },
        { icon: Image, label: '廣告管理', href: '/admin/banners' },
        { icon: DollarSign, label: '財務報表', href: '/admin/finance' },
        { icon: Settings, label: '系統設定', href: '/admin/settings' },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 min-h-screen bg-white border-r border-gray-200 fixed left-0 top-0">
                    <div className="p-6 border-b border-gray-200">
                        <Link href="/admin/dashboard" className="flex items-center gap-3">
                            <Lantern size="sm" color="red" animate />
                            <div>
                                <h1 className="font-temple font-bold text-temple-red-700">台灣點燈網</h1>
                                <p className="text-xs text-gray-500">管理後台</p>
                            </div>
                        </Link>
                    </div>

                    <nav className="p-4">
                        <ul className="space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon
                                const isActive = pathname === item.href
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                                    ? 'bg-temple-red-50 text-temple-red-700 font-medium'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {item.label}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>

                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-gray-600 hover:text-temple-red-600"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            登出系統
                        </Button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 ml-64">
                    {children}
                </main>
            </div>
        </div>
    )
}
