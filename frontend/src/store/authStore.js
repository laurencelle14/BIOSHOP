import { create } from 'zustand'

const useAuthStore = create((set) => ({
  // State
  user: null,
  accessToken: localStorage.getItem('access_token') || null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  isStaff: false,

  // Actions
  login: (user, accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isStaff: user?.is_staff || user?.is_superuser || false
    })
  },

  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    set({ user: null, accessToken: null, isAuthenticated: false, isStaff: false })
  },

  setUser: (user) => set({
    user,
    isStaff: user?.is_staff || user?.is_superuser || false
  }),
}))

export default useAuthStore