export default function AdminOverview() {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-slate-900 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-2">Total Products</div>
          <div className="text-4xl font-bold text-slate-900">0</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-2">Total Orders</div>
          <div className="text-4xl font-bold text-slate-900">0</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-2">Total Customers</div>
          <div className="text-4xl font-bold text-slate-900">0</div>
        </div>
      </div>
    </div>
  )
}
