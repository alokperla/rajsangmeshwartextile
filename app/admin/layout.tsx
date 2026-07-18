'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'ADMIN') {
        router.push('/')
      }
    }
  }, [user, authLoading, router])

  if (authLoading || !user || user.role !== 'ADMIN') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-slate-500">Verifying access...</div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-73px)] overflow-hidden bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Admin Dashboard</div>
          <nav className="space-y-2">
            <Link href="/admin" className="block px-4 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-medium">
              Overview
            </Link>
            <Link href="/admin/products" className="block px-4 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-medium">
              Products
            </Link>
            <Link href="/admin/orders" className="block px-4 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-medium">
              Orders
            </Link>
            <Link href="/admin/users" className="block px-4 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-medium">
              Customers
            </Link>
          </nav>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
