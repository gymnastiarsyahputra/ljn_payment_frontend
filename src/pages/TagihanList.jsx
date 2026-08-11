import { useEffect, useState } from 'react'
import { getAllTagihan } from '../api/tagihanApi'
import Badge from '../components/ui/Badge'
import { formatCurrency } from '../utils/formatCurrency'
import { formatDate } from '../utils/formatDate'
import Modal from '../components/ui/Modal'
import TagihanForm from '../components/forms/TagihanForm'

const bulanNama = [
  '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

function TagihanList() {
  const [tagihan, setTagihan] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await getAllTagihan()
      setTagihan(data)
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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">ID Pelanggan</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Periode</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Jumlah Tagihan</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Jatuh Tempo</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tagihan.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                  Belum ada data tagihan
                </td>
              </tr>
            ) : (
              tagihan.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-600">#{t.id_pelanggan}</td>
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