import { useEffect, useState } from 'react'
import { getAllTransaksi } from '../api/transaksiApi'
import { getAllPelanggan } from '../api/pelangganApi'
import { getAllTagihan } from '../api/tagihanApi'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import BuktiPembayaran from '../components/BuktiPembayaran'
import { formatCurrency } from '../utils/formatCurrency'

const bulanNama = [
  '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

function TransaksiHistory() {
  const [transaksi, setTransaksi] = useState([])
  const [pelangganMap, setPelangganMap] = useState({})
  const [tagihanMap, setTagihanMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTransaksi, setSelectedTransaksi] = useState(null)
  const [pelangganNama, setPelangganNama] = useState('')
  const [periodeTagihan, setPeriodeTagihan] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const [dataTransaksi, dataPelanggan, dataTagihan] = await Promise.all([
        getAllTransaksi(),
        getAllPelanggan(),
        getAllTagihan(),
      ])
      const sorted = [...dataTransaksi].sort(
        (a, b) => new Date(b.waktu_transaksi) - new Date(a.waktu_transaksi)
      )
      setTransaksi(sorted)

      const pMap = {}
      dataPelanggan.forEach((p) => { pMap[p.id] = p.nama })
      setPelangganMap(pMap)

      const tMap = {}
      dataTagihan.forEach((t) => {
        tMap[t.id] = {
          id_pelanggan: t.id_pelanggan,
          periode: `${bulanNama[t.periode_bulan]} ${t.periode_tahun}`,
        }
      })
      setTagihanMap(tMap)
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

  const handleLihatBukti = (t) => {
    const tagihanInfo = tagihanMap[t.id_tagihan]
    setPelangganNama(pelangganMap[tagihanInfo?.id_pelanggan] || 'Pelanggan')
    setPeriodeTagihan(tagihanInfo?.periode || '-')
    setSelectedTransaksi(t)
  }

  const handlePrint = () => {
    window.print()
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
                      
                      <a  href={t.payment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm font-medium hover:underline"
                      >
                        Buka Link Bayar
                      </a>
                    )}
                    {t.status_pembayaran === 'success' && (
                      <button
                        onClick={() => handleLihatBukti(t)}
                        className="text-green-600 text-sm font-medium hover:underline"
                      >
                        Lihat Bukti
                      </button>
                    )}
                    {(t.status_pembayaran === 'expired' || t.status_pembayaran === 'failed') && (
                      <span className="text-gray-300 text-sm">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!selectedTransaksi}
        onClose={() => setSelectedTransaksi(null)}
        title="Bukti Pembayaran"
      >
        {selectedTransaksi && (
          <div>
            <BuktiPembayaran
              transaksi={selectedTransaksi}
              namaPelanggan={pelangganNama}
              periode={periodeTagihan}
            />
            <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-100 print:hidden">
              <button
                onClick={() => setSelectedTransaksi(null)}
                className="px-4 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-100"
              >
                Tutup
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:opacity-90"
              >
                Cetak
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default TransaksiHistory