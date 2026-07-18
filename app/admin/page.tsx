export default function AdminOverview() {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-slate-50/80 p-5 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Overview</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-2 text-sm font-medium text-slate-500">Total Products</div>
          <div className="text-4xl font-bold text-slate-900">0</div>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-2 text-sm font-medium text-slate-500">Total Orders</div>
          <div className="text-4xl font-bold text-slate-900">0</div>
        </div>
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-2 text-sm font-medium text-slate-500">Total Customers</div>
          <div className="text-4xl font-bold text-slate-900">0</div>
        </div>
      </div>
    </div>
  )
}
