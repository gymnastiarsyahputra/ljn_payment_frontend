const statusStyles = {
  aktif: 'bg-green-100 text-green-700',
  suspend: 'bg-yellow-100 text-yellow-700',
  berhenti: 'bg-gray-100 text-gray-600',
  lunas: 'bg-green-100 text-green-700',
  belum_bayar: 'bg-yellow-100 text-yellow-700',
  terlambat: 'bg-red-100 text-red-700',
  success: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  expired: 'bg-gray-100 text-gray-600',
}

function Badge({ status }) {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-600'
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${style}`}>
      {status?.replace('_', ' ')}
    </span>
  )
}

export default Badge