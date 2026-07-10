import axios from 'axios'

// Toutes les requêtes du frontend passent par le backend principal (gateway REST).
// Le frontend ne parle jamais directement aux microservices (service-reviews,
// service-recommendations) - c'est backend-main qui orchestre.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attache automatiquement le JWT (stocké par AuthContext) à chaque requête.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cinematch_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Callback branché par AuthContext pour réagir globalement à un 401/403
// (token expiré ou invalide) : on nettoie la session et on renvoie vers /login.
let onUnauthorized = () => {}
export function setOnUnauthorized(callback) {
  onUnauthorized = callback
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      onUnauthorized()
    }
    return Promise.reject(error)
  }
)

export default apiClient
export { API_URL }
