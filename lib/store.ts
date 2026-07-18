import { create } from 'zustand'
import axios from 'axios'
import { auth, db } from './firebase'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const getAdminEmail = () => {
  return 'alokperla8055@gmail.com'
}

const isAdminEmail = (email?: string | null) => {
  const normalizedEmail = email?.toLowerCase()
  return normalizedEmail === getAdminEmail()
}

export interface User {
  id: string
  email: string
  name?: string
  role: string
}

interface Product {
  id: string // Firestore uses string IDs
  name: string
  category: string
  price: number
  image: string
  description?: string
  stock: number
}

interface CartItem {
  id: string
  product: Product
  quantity: number
}

interface AuthState {
  user: User | null
  token: string | null
  authLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  initialize: () => void
}

interface CartState {
  items: CartItem[]
  fetchCart: () => Promise<void>
  addToCart: (productId: string, quantity: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
}

const getAuthToken = async () => {
  if (typeof window === 'undefined') return null

  const storedToken = localStorage.getItem('token')
  if (storedToken) return storedToken

  const currentUser = auth.currentUser
  if (currentUser) {
    const freshToken = await currentUser.getIdToken()
    localStorage.setItem('token', freshToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${freshToken}`
    return freshToken
  }

  return null
}

// Setup axios interceptor to add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  authLoading: true,
  initialize: () => {
    onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken()
        localStorage.setItem('token', token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        // Fetch custom user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        const userData = userDoc.data()
        const resolvedRole = isAdminEmail(firebaseUser.email) ? 'ADMIN' : (userData?.role || 'CUSTOMER')

        if (userData?.role !== resolvedRole) {
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            email: firebaseUser.email,
            name: userData?.name || firebaseUser.displayName || '',
            role: resolvedRole,
            updatedAt: new Date().toISOString()
          }, { merge: true })
        }
        
        set({ 
          user: { 
            id: firebaseUser.uid, 
            email: firebaseUser.email || '', 
            name: userData?.name || firebaseUser.displayName || '',
            role: resolvedRole
          }, 
          token,
          authLoading: false
        })
      } else {
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        set({ user: null, token: null, authLoading: false })
      }
    })
  },
  login: async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password)
    // onAuthStateChanged will handle the state update
  },
  register: async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const uid = userCredential.user.uid
    
    const role = isAdminEmail(email) ? 'ADMIN' : 'CUSTOMER'

    // Create user document in Firestore
    await setDoc(doc(db, 'users', uid), {
      email,
      name,
      role,
      createdAt: new Date().toISOString()
    })

    // onAuthStateChanged will handle the state update
  },
  logout: async () => {
    await signOut(auth)
  }
}))

export const useCart = create<CartState>((set, get) => ({
  items: [],
  fetchCart: async () => {
    try {
      const token = await getAuthToken()
      if (!token) {
        set({ items: [] })
        return
      }

      const res = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      })
      set({ items: res.data.items || [] })
    } catch (error: any) {
      if (error.response?.status !== 401) {
        console.error('Failed to fetch cart:', error.message)
      }
      set({ items: [] })
    }
  },
  addToCart: async (productId, quantity) => {
    try {
      const token = await getAuthToken()
      if (!token) {
        throw new Error('Please log in to add items to your cart.')
      }

      await axios.post('/api/cart', { productId, quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      await get().fetchCart()
    } catch (error: any) {
      if (error.response?.status !== 401) {
        console.error('Failed to add to cart:', error.message)
      }
      throw error
    }
  },
  removeFromCart: async (itemId) => {
    try {
      const token = await getAuthToken()
      if (!token) {
        throw new Error('Please log in to manage your cart.')
      }

      await axios.delete(`/api/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      await get().fetchCart()
    } catch (error: any) {
      if (error.response?.status !== 401) {
        console.error('Failed to remove from cart:', error.message)
      }
      throw error
    }
  }
}))

if (typeof window !== 'undefined') {
  useAuth.getState().initialize()
}

// ── TOAST STORE ──
interface Toast {
  id: string
  message: string
}

interface ToastState {
  toasts: Toast[]
  showToast: (message: string) => void
  removeToast: (id: string) => void
}

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  showToast: (message) => {
    const id = Math.random().toString(36).slice(2)
    set((s) => ({ toasts: [...s.toasts, { id, message }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 3000)
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

// ── CART SIDEBAR STORE ──
interface CartSidebarState {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export const useCartSidebar = create<CartSidebarState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}))