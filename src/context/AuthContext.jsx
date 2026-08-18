import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('token'))
  const [adminName, setAdminName] = useState(() => sessionStorage.getItem('adminName'))

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('token', token)
    } else {
      sessionStorage.removeItem('token')
    }
  }, [token])

  const loginUser = (accessToken, nama) => {
    setToken(accessToken)
    setAdminName(nama)
    sessionStorage.setItem('adminName', nama)
  }

  const logoutUser = () => {
    setToken(null)
    setAdminName(null)
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('adminName')
  }

  return (
    <AuthContext.Provider value={{ token, adminName, loginUser, logoutUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}