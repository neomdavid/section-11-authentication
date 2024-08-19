import { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { refreshToken } from '../util/auth'

export const AuthContext = createContext({
  token: '',
  isAuthenticated: false,
  authenticate: (tokens) => {},
  logout: () => {},
})

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState(null)

  useEffect(() => {
    async function loadToken() {
      try {
        const storedIdToken = await AsyncStorage.getItem('idToken')
        const storedRefreshToken = await AsyncStorage.getItem('refreshToken')
        if (storedIdToken && storedRefreshToken) {
          setAuthToken(storedIdToken)
        }
      } catch (error) {
        console.log('Failed to load token:', error)
      }
    }

    loadToken()
  }, [])

  async function authenticate({ idToken, refreshToken }) {
    setAuthToken(idToken)
    try {
      await AsyncStorage.setItem('idToken', idToken)
      await AsyncStorage.setItem('refreshToken', refreshToken)
    } catch (error) {
      console.log('Failed to store token:', error)
    }
  }

  function logout() {
    setAuthToken(null)
    AsyncStorage.removeItem('idToken')
    AsyncStorage.removeItem('refreshToken')
  }

  async function refreshTokenPeriodically() {
    try {
      const tokens = await refreshToken()
      setAuthToken(tokens.newIdToken)
      await AsyncStorage.setItem('idToken', tokens.newIdToken)
      await AsyncStorage.setItem('refreshToken', tokens.newRefreshToken)
    } catch (error) {
      console.log('Failed to refresh token:', error)
      logout() // Handle logout if token refresh fails
    }
  }

  useEffect(() => {
    if (authToken) {
      const intervalId = setInterval(refreshTokenPeriodically, 1000 * 60 * 55)
      return () => clearInterval(intervalId)
    }
  }, [authToken])

  const value = {
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContextProvider
