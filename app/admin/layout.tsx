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
    <div className="min-h-screen bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_45%,_#fef3c7_100%)] text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6">
        <aside className="w-full shrink-0 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-72">
          <div className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 shadow-xl ring-1 ring-slate-200 backdrop-blur">
            <div className="border-b border-slate-200 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Admin Panel</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">Rajsangmeshwar Textile</h2>
              <p className="mt-2 text-sm text-slate-500">Manage inventory, orders, and customers from one place.</p>
            </div>
            <nav className="flex-1 space-y-2 p-4">
              <Link href="/admin" className="flex items-center rounded-2xl px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
                Overview
              </Link>
              <Link href="/admin/products" className="flex items-center rounded-2xl px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
                Products
              </Link>
              <Link href="/admin/orders" className="flex items-center rounded-2xl px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
                Orders
              </Link>
              <Link href="/admin/users" className="flex items-center rounded-2xl px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
                Customers
              </Link>
            </nav>
            <div className="border-t border-slate-200 p-4">
              <div className="rounded-2xl bg-slate-900 px-4 py-3 text-sm text-white">
                <p className="font-medium">Signed in as</p>
                <p className="mt-1 text-slate-300">{user?.email}</p>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex-1 rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-xl ring-1 ring-slate-200 backdrop-blur lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
