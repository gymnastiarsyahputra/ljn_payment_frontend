import { useEffect, useState } from 'react'
import { getAllTransaksi, regenerateTransaksi } from '../api/transaksiApi'
import Badge from '../components/ui/Badge'
import { formatCurrency } from '../utils/formatCurrency'

function TransaksiHistory() {
  const [transaksi, setTransaksi] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)  
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [actionError, setActionError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await getAllTransaksi()
      const sorted = [...data].sort(
        (a, b) => new Date(b.waktu_transaksi) - new Date(a.waktu_transaksi)
      )
      setTransaksi(sorted)
    } catch (err) {
      setError('Gagal memuat data transaksi. Pastikan backend sedang berjalan.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const formatDateTime = (value) => {
    if (!value) return '-'
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  }

  const handleRegenerate = async (idTagihan) => {
    setActionLoadingId(idTagihan)
    setActionError(null)
    try {
      const result = await regenerateTransaksi(idTagihan)
      // langsung buka link pembayaran yang baru di tab baru
      window.open(result.payment_url, '_blank')
      await fetchData()
    } catch (err) {
      const message = err.response?.data?.detail || 'Gagal membuat ulang transaksi.'
      setActionError(message)
      console.error(err)
    } finally {
      setActionLoadingId(null)
    }
  }

  if (loading) {
    return <p className="text-gray-500">Memuat riwayat transaksi...</p>
  }

  if (error) {
    return <p className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Riwayat Transaksi</h1>

      {actionError && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">{actionError}</p>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Order ID</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">ID Tagihan</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Jumlah</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Metode</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Waktu Transaksi</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transaksi.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                  Belum ada riwayat transaksi
                </td>
              </tr>
            ) : (
              transaksi.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-600 font-mono text-xs">{t.order_id}</td>
                  <td className="px-6 py-4 text-gray-600">#{t.id_tagihan}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {formatCurrency(t.jumlah_dibayar)}
                  </td>
                  <td className="px-6 py-4 text-gray-600 capitalize">
                    {t.metode_pembayaran?.replace('_', ' ') || '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDateTime(t.waktu_transaksi)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={t.status_pembayaran} />
                  </td>
                  <td className="px-6 py-4">
                    {t.status_pembayaran === 'pending' && t.payment_url && (
                      <a
                        href={t.payment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm font-medium hover:underline"
                      >
                        Buka Link Bayar
                      </a>
                    )}
                    {(t.status_pembayaran === 'expired' || t.status_pembayaran === 'failed') && (
                      <button
                        onClick={() => handleRegenerate(t.id_tagihan)}
                        disabled={actionLoadingId === t.id_tagihan}
                        className="text-brand-orange text-sm font-medium hover:underline disabled:opacity-50"
                      >
                        {actionLoadingId === t.id_tagihan ? 'Memproses...' : 'Buat Ulang'}
                      </button>
                    )}
                    {(t.status_pembayaran === 'success') && (
                      <span className="text-gray-300 text-sm">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TransaksiHistory