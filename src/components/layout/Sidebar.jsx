import { Link, useLocation } from 'react-router-dom'

const menuItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Pelanggan', path: '/pelanggan' },
  { label: 'Paket Langganan', path: '/paket' },
  { label: 'Tagihan', path: '/tagihan' },
  { label: 'Riwayat Transaksi', path: '/transaksi' },
  { label: 'Tambah Admin', path: '/pengaturan/admin' },
]

function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 min-h-screen bg-brand-navy text-white flex flex-col">
      <div className="p-6 border-b border-white/10">
        <img src="/logoljn.png" alt="LJN MUBA" className="h-10 mb-1" />
        <p className="text-sm text-white/60">Payment System</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-brand-orange text-white font-semibold'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar