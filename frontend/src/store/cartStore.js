import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(persist(
  (set, get) => ({
    // State
    items: [],

    // Actions
    addItem: (product, quantity = 1) => {
      const items = get().items
      const existing = items.find(item => item.id === product.id)

      if (existing) {
        set({
          items: items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        })
      } else {
        set({ items: [...items, { ...product, quantity }] })
      }
    },

    removeItem: (productId) => {
      set({ items: get().items.filter(item => item.id !== productId) })
    },

    updateQuantity: (productId, quantity) => {
      set({
        items: get().items.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      })
    },

    clearCart: () => set({ items: [] }),

    // Calculs
    totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  }),
  { name: 'bioshop-cart' }
))

export default useCartStore
