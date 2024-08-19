import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const API_KEY = 'AIzaSyAlbMwqcB24IS_RrDuiCaEanuiw1uxzOKI'

async function authenticate(mode, email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`
  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  })

  const token = response.data.idToken
  const refreshToken = response.data.refreshToken
  return { idToken: token, refreshToken: refreshToken }
}

export function createUser(email, password) {
  return authenticate('signUp', email, password)
}

export function login(email, password) {
  return authenticate('signInWithPassword', email, password)
}

export async function refreshToken() {
  const refreshToken = await AsyncStorage.getItem('refreshToken')
  const url = `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`

  const response = await axios.post(url, {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  })

  return {
    newIdToken: response.data.id_token,
    newRefreshToken: response.data.refresh_token,
  }
}
