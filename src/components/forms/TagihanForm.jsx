import { useEffect, useState } from 'react'
import { createTagihan } from '../../api/tagihanApi'
import { getAllPelanggan } from '../../api/pelangganApi'

const bulanOptions = [
  { value: 1, label: 'Januari' }, { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' }, { value: 4, label: 'April' },
  { value: 5, label: 'Mei' }, { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' }, { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' }, { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' }, { value: 12, label: 'Desember' },
]

function TagihanForm({ onSuccess, onCancel }) {
  const [pelangganList, setPelangganList] = useState([])
  const [formData, setFormData] = useState({
    id_pelanggan: '',
    periode_bulan: new Date().getMonth() + 1,
    periode_tahun: new Date().getFullYear(),
    tanggal_jatuh_tempo: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPelanggan = async () => {
      try {
        const data = await getAllPelanggan()
        setPelangganList(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchPelanggan()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await createTagihan({
        id_pelanggan: parseInt(formData.id_pelanggan),
        periode_bulan: parseInt(formData.periode_bulan),
        periode_tahun: parseInt(formData.periode_tahun),
        tanggal_jatuh_tempo: formData.tanggal_jatuh_tempo,
      })
      onSuccess()
    } catch (err) {
      const message = err.response?.data?.detail || 'Gagal membuat tagihan. Periksa kembali data yang diisi.'
      setError(message)
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Pelanggan</label>
        <select
          name="id_pelanggan"
          value={formData.id_pelanggan}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">-- Pilih Pelanggan --</option>
          {pelangganList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nama} ({p.email})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
          <select
            name="periode_bulan"
            value={formData.periode_bulan}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {bulanOptions.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
          <input
            type="number"
            name="periode_tahun"
            value={formData.periode_tahun}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Jatuh Tempo</label>
        <input
          type="date"
          name="tanggal_jatuh_tempo"
          value={formData.tanggal_jatuh_tempo}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <p className="text-xs text-gray-400">
        Jumlah tagihan akan otomatis dihitung sesuai harga paket langganan pelanggan yang dipilih.
      </p>

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

export default TagihanForm