import { useEffect, useMemo, useState } from 'react'
import { getAllTagihan } from '../api/tagihanApi'
import { getAllPelanggan } from '../api/pelangganApi'
import { createTransaksi } from '../api/transaksiApi'
import Badge from '../components/ui/Badge'
import { formatCurrency } from '../utils/formatCurrency'
import { formatDate } from '../utils/formatDate'
import Modal from '../components/ui/Modal'
import TagihanForm from '../components/forms/TagihanForm'
import SearchBar from '../components/ui/SearchBar'

const bulanNama = [
  '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

function TagihanList() {
  const [tagihan, setTagihan] = useState([])
  const [pelangganMap, setPelangganMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTagihan = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()
    if (!keyword) return tagihan
    return tagihan.filter((t) =>
      (pelangganMap[t.id_pelanggan] || '').toLowerCase().includes(keyword)
    )
  }, [tagihan, pelangganMap, searchTerm])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [dataTagihan, dataPelanggan] = await Promise.all([
        getAllTagihan(),
        getAllPelanggan(),
      ])
      setTagihan(dataTagihan)

      const map = {}
      dataPelanggan.forEach((p) => {
        map[p.id] = p.nama
      })
      setPelangganMap(map)
    } catch (err) {
      setError('Gagal memuat data tagihan. Pastikan backend sedang berjalan.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSuccess = () => {
    setIsModalOpen(false)
    fetchData()
  }

  const handleBuatTransaksi = async (idTagihan) => {
    setActionLoadingId(idTagihan)
    setActionError(null)
    try {
      const result = await createTransaksi(idTagihan)
      window.open(result.payment_url, '_blank')
      await fetchData()
    } catch (err) {
      const message = err.response?.data?.detail || 'Gagal membuat link pembayaran.'
      setActionError(message)
      console.error(err)
    } finally {
      setActionLoadingId(null)
    }
  }

  if (loading) {
    return <p className="text-gray-500">Memuat data tagihan...</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Tagihan</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          + Buat Tagihan
        </button>
      </div>

      {error && (
        <p className="text-red-600 bg-red-50 p-4 rounded-lg mb-4">{error}</p>
      )}
      {actionError && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">{actionError}</p>
      )}

      <div className="mb-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Cari nama pelanggan..."
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">ID Pelanggan</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Nama</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Periode</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Jumlah Tagihan</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Jatuh Tempo</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTagihan.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                  {searchTerm ? `Tidak ada tagihan untuk pelanggan "${searchTerm}"` : 'Belum ada data tagihan'}
                </td>
              </tr>
            ) : (
              filteredTagihan.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-400 font-mono text-xs">#{t.id_pelanggan}</td>
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    {pelangganMap[t.id_pelanggan] || '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {bulanNama[t.periode_bulan]} {t.periode_tahun}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {formatCurrency(t.jumlah_tagihan)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(t.tanggal_jatuh_tempo)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={t.status} />
                  </td>
                  <td className="px-6 py-4">
                    {t.status === 'belum_bayar' && (
                      <button
                        onClick={() => handleBuatTransaksi(t.id)}
                        disabled={actionLoadingId === t.id}
                        className="text-primary text-sm font-medium hover:underline disabled:opacity-50"
                      >
                        {actionLoadingId === t.id ? 'Memproses...' : 'Buat Link Bayar'}
                      </button>
                    )}
                    {t.status === 'lunas' && (
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Tagihan Baru"
      >
        <TagihanForm
          onSuccess={handleSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default TagihanList