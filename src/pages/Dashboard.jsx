import { useEffect, useState } from 'react'
import { getAllPelanggan } from '../api/pelangganApi'
import { getAllTagihan } from '../api/tagihanApi'
import { formatCurrency } from '../utils/formatCurrency'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

function StatCard({ label, value, subtext, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  )
}

function Dashboard() {
  const [stats, setStats] = useState({
    totalPelanggan: 0,
    totalTagihan: 0,
    tagihanLunas: 0,
    tagihanBelumBayar: 0,
    totalPendapatan: 0,
  })
  const [loading, setLoading] = useState(true)
  const [pendapatanBulanan, setPendapatanBulanan] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pelanggan, tagihan] = await Promise.all([
          getAllPelanggan(),
          getAllTagihan(),
        ])

        const lunas = tagihan.filter((t) => t.status === 'lunas')
        const belumBayar = tagihan.filter((t) => t.status === 'belum_bayar')
        const pendapatan = lunas.reduce((sum, t) => sum + Number(t.jumlah_tagihan), 0)

        const bulanNama = [
          '', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
          'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

        const groupedByMonth = {}
        lunas.forEach((t) => {
          const key = `${t.periode_tahun}-${String(t.periode_bulan).padStart(2, '0')}`
          if (!groupedByMonth[key]) {
            groupedByMonth[key] = {
              key,
              label: `${bulanNama[t.periode_bulan]} ${t.periode_tahun}`,
              total: 0,
            }
          }
          groupedByMonth[key].total += Number(t.jumlah_tagihan)
        })

        const chartData = Object.values(groupedByMonth).sort((a, b) => a.key.localeCompare(b.key))
        setPendapatanBulanan(chartData)

        setStats({
          totalPelanggan: pelanggan.length,
          totalTagihan: tagihan.length,
          tagihanLunas: lunas.length,
          tagihanBelumBayar: belumBayar.length,
          totalPendapatan: pendapatan,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return <p className="text-gray-500">Memuat ringkasan data...</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Pelanggan"
          value={stats.totalPelanggan}
          color="text-brand-navy"
        />
        <StatCard
          label="Total Tagihan"
          value={stats.totalTagihan}
          color="text-brand-navy"
        />
        <StatCard
          label="Tagihan Lunas"
          value={stats.tagihanLunas}
          subtext={`${stats.tagihanBelumBayar} belum bayar`}
          color="text-green-600"
        />
        <StatCard
          label="Total Pendapatan"
          value={formatCurrency(stats.totalPendapatan)}
          subtext="Dari tagihan lunas"
          color="text-primary"
        />
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Pendapatan per Bulan</h2>
        {pendapatanBulanan.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Belum ada data pendapatan</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pendapatanBulanan}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toLocaleString('id-ID')}rb`}
              />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="total" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

export default Dashboard