import { formatCurrency } from '../utils/formatCurrency'

function BuktiPembayaran({ transaksi, namaPelanggan, periode }) {
  const formatDateTime = (value) => {
    if (!value) return '-'
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(value))
  }

  return (
    <div id="bukti-pembayaran-print" className="text-sm">
      <div className="border border-dashed border-gray-300 rounded-lg p-5">
        <div className="text-center mb-5 pb-4 border-b border-gray-200">
          <img
            src="/logo_ljn_muba.png"
            alt="LJN MUBA"
            className="h-10 mx-auto mb-2 object-contain"
          />
          <p className="text-gray-500 text-xs">Bukti Pembayaran WiFi</p>
        </div>

        <div className="flex justify-center mb-4">
          <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-semibold tracking-wide">
            ✓ PEMBAYARAN BERHASIL
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-500">No. Referensi</span>
            <span className="font-mono text-xs">{transaksi.order_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Nama Pelanggan</span>
            <span className="font-medium">{namaPelanggan}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Periode Tagihan</span>
            <span className="font-medium">{periode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Metode Pembayaran</span>
            <span className="capitalize">{transaksi.metode_pembayaran?.replace('_', ' ') || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Waktu Pembayaran</span>
            <span>{formatDateTime(transaksi.waktu_pembayaran)}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-300 pt-4 mb-4">
          <div className="flex justify-between text-base font-bold text-gray-800">
            <span>Total Dibayar</span>
            <span className="text-primary">{formatCurrency(transaksi.jumlah_dibayar)}</span>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 border-t border-gray-100 pt-3">
          Terima kasih telah menggunakan layanan LJN MUBA
        </p>
      </div>
    </div>
  )
}

export default BuktiPembayaran