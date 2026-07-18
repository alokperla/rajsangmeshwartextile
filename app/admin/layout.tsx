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

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-slate-500">Verifying access...</div>
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-slate-500">Verifying access...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc_0%,_#eef2ff_100%)] text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6">
        <aside className="w-full rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-xl ring-1 ring-slate-200 backdrop-blur lg:w-72">
          <div className="mb-6">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Admin Dashboard</div>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Rajsangmeshwar Textile</h2>
          </div>
          <nav className="space-y-2">
            <Link href="/admin" className="block rounded-2xl px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
              Overview
            </Link>
            <Link href="/admin/products" className="block rounded-2xl px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
              Products
            </Link>
            <Link href="/admin/orders" className="block rounded-2xl px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
              Orders
            </Link>
            <Link href="/admin/users" className="block rounded-2xl px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
              Customers
            </Link>
          </nav>
        </aside>
        <main className="flex-1 rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-xl ring-1 ring-slate-200 backdrop-blur">
          {children}
        </main>
      </div>
    </div>
  )
}
