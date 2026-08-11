import { useEffect, useState } from 'react'
import { getAllPelanggan } from '../api/pelangganApi'
import { getAllPaket } from '../api/paketApi'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import PelangganForm from '../components/forms/PelangganForm'

function PelangganList() {
  const [pelanggan, setPelanggan] = useState([])
  const [paketMap, setPaketMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [dataPelanggan, dataPaket] = await Promise.all([
        getAllPelanggan(),
        getAllPaket(),
      ])
      setPelanggan(dataPelanggan)

      // Bikin map { id_paket: nama_paket } biar gampang di-lookup pas render tabel
      const map = {}
      dataPaket.forEach((p) => {
        map[p.id] = p.nama_paket
      })
      setPaketMap(map)
    } catch (err) {
      setError('Gagal memuat data pelanggan. Pastikan backend sedang berjalan.')
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
    return <p className="text-gray-500">Memuat data pelanggan...</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Pelanggan</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          + Tambah Pelanggan
        </button>
      </div>

      {error && (
        <p className="text-red-600 bg-red-50 p-4 rounded-lg mb-4">{error}</p>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">ID</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Nama</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Email</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">No. HP</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Alamat</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Paket</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pelanggan.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                  Belum ada data pelanggan
                </td>
              </tr>
            ) : (
              pelanggan.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-400 font-mono text-xs">#{p.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{p.nama}</td>
                  <td className="px-6 py-4 text-gray-600">{p.email}</td>
                  <td className="px-6 py-4 text-gray-600">{p.no_hp}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={p.alamat}>
                    {p.alamat || '-'}
                  </td>
                  <td className="px-6 py-4">
                    {p.id_paket && paketMap[p.id_paket] ? (
                      <span className="text-gray-700">{paketMap[p.id_paket]}</span>
                    ) : (
                      <span className="text-orange-500 text-xs font-medium bg-orange-50 px-2 py-1 rounded">
                        Belum Pilih Paket
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={p.status_langganan} />
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
        title="Tambah Pelanggan Baru"
      >
        <PelangganForm
          onSuccess={handleSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default PelangganList