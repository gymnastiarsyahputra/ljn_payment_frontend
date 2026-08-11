function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
          A
        </div>
        <span className="text-sm text-gray-600">Admin</span>
      </div>
    </header>
  )
}

export default Header