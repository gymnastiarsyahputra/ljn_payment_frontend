import { Routes, Route } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PelangganList from './pages/PelangganList'
import PaketList from './pages/PaketList'
import TagihanList from './pages/TagihanList'
import TransaksiHistory from './pages/TransaksiHistory'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/pelanggan" element={<PelangganList />} />
                <Route path="/paket" element={<PaketList />} />
                <Route path="/tagihan" element={<TagihanList />} />
                <Route path="/transaksi" element={<TransaksiHistory />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App