import { useEffect, useState } from 'react'
import { createPelanggan } from '../../api/pelangganApi'
import { getAllPaket } from '../../api/paketApi'

function PelangganForm({ onSuccess, onCancel }) {
  const [paketList, setPaketList] = useState([])
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    no_hp: '',
    alamat: '',
    id_paket: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPaket = async () => {
      try {
        const data = await getAllPaket()
        setPaketList(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchPaket()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await createPelanggan({
        ...formData,
        id_paket: formData.id_paket ? parseInt(formData.id_paket) : null,
      })
      onSuccess()
    } catch (err) {
      setError('Gagal menambahkan pelanggan. Cek kembali data yang diisi (email mungkin sudah terpakai).')
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
        <input
          type="text"
          name="nama"
          value={formData.nama}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">No. HP</label>
        <input
          type="text"
          name="no_hp"
          value={formData.no_hp}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
        <textarea
          name="alamat"
          value={formData.alamat}
          onChange={handleChange}
          rows="2"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Paket Langganan</label>
        <select
          name="id_paket"
          value={formData.id_paket}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">-- Belum Pilih Paket --</option>
          {paketList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nama_paket} — Rp{Number(p.harga_bulanan).toLocaleString('id-ID')}/bulan
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-400 mt-1">
          Wajib dipilih sebelum tagihan bisa dibuat untuk pelanggan ini.
        </p>
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

export default PelangganForm