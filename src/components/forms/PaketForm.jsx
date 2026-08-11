import { useState } from 'react'
import { createPaket } from '../../api/paketApi'

function PaketForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    nama_paket: '',
    kecepatan: '',
    harga_bulanan: '',
    deskripsi: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await createPaket({
        ...formData,
        harga_bulanan: parseFloat(formData.harga_bulanan),
      })
      onSuccess()
    } catch (err) {
      setError('Gagal menambahkan paket. Periksa kembali data yang diisi.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Paket</label>
        <input
          type="text"
          name="nama_paket"
          value={formData.nama_paket}
          onChange={handleChange}
          placeholder="Contoh: 30 Mbps"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kecepatan</label>
        <input
          type="text"
          name="kecepatan"
          value={formData.kecepatan}
          onChange={handleChange}
          placeholder="Contoh: 30 Mbps"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Harga Bulanan (Rp)</label>
        <input
          type="number"
          name="harga_bulanan"
          value={formData.harga_bulanan}
          onChange={handleChange}
          placeholder="Contoh: 300000"
          required
          min="0"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
        <textarea
          name="deskripsi"
          value={formData.deskripsi}
          onChange={handleChange}
          rows="2"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-100"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  )
}

export default PaketForm