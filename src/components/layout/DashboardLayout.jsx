import Sidebar from './Sidebar'
import Header from './Header'

function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-50">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout