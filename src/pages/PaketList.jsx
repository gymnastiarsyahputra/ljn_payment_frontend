import { useEffect, useMemo, useState } from 'react'
import { getAllPaket } from '../api/paketApi'
import { formatCurrency } from '../utils/formatCurrency'
import Modal from '../components/ui/Modal'
import PaketForm from '../components/forms/PaketForm'
import SearchBar from '../components/ui/SearchBar'

function PaketList() {
  const [paket, setPaket] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPaket = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()
    if (!keyword) return paket
    return paket.filter((p) => p.nama_paket?.toLowerCase().includes(keyword))
  }, [paket, searchTerm])

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await getAllPaket()
      setPaket(data)
    } catch (err) {
      setError('Gagal memuat data paket. Pastikan backend sedang berjalan.')
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
    return <p className="text-gray-500">Memuat data paket...</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Paket Langganan</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          + Tambah Paket
        </button>
      </div>

      {error && (
        <p className="text-red-600 bg-red-50 p-4 rounded-lg mb-4">{error}</p>
      )}

      <div className="mb-4">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Cari nama paket..."
        />
      </div>

      {filteredPaket.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          {searchTerm ? `Tidak ada paket dengan nama "${searchTerm}"` : 'Belum ada data paket langganan'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPaket.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 relative">
              <span className="absolute top-4 right-4 text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
                ID: {p.id}
              </span>
              <h3 className="text-lg font-bold text-brand-navy mb-1 pr-16">{p.nama_paket}</h3>
              <p className="text-sm text-gray-500 mb-4">{p.kecepatan || '-'}</p>
              <p className="text-2xl font-bold text-primary mb-2">
                {formatCurrency(p.harga_bulanan)}
                <span className="text-sm font-normal text-gray-500"> /bulan</span>
              </p>
              {p.deskripsi && (
                <p className="text-sm text-gray-600 border-t border-gray-100 pt-3 mt-3">
                  {p.deskripsi}
                </p>
              )}
            </div>
))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Paket Langganan"
      >
        <PaketForm
          onSuccess={handleSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default PaketList