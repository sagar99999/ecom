// store/cartStore.ts
import { createStore } from "zustand/vanilla";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
    quantity: number;
};

export type CartState = {
    items: CartItem[];
};

export type CartActions = {
    addToCart: (product: Omit<CartItem, "quantity">) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getTotalItems: () => number;
};

export type CartStore = CartState & CartActions;

export const defaultInitState: CartState = {
    items: [],
};

export const createCartStore = (initState: CartState = defaultInitState) => {
    return createStore<CartStore>()(
        devtools(
            persist(
                (set, get) => ({
                    ...initState,

                    addToCart: (product) => {
                        const items = get().items;
                        const existing = items.find((item) => item._id === product._id);
                        if (existing) {
                            set({
                                items: items.map((item) =>
                                    item._id === product._id
                                        ? { ...item, quantity: item.quantity + 1 }
                                        : item
                                ),
                            }, false, "cart/addToCart(increment)");  // ✅ action name in devtools
                        } else {
                            set(
                                { items: [...items, { ...product, quantity: 1 }] },
                                false,
                                "cart/addToCart(new)"  // ✅ action name in devtools
                            );
                        }
                    },

                    removeFromCart: (productId) =>
                        set(
                            { items: get().items.filter((item) => item._id !== productId) },
                            false,
                            "cart/removeFromCart"  // ✅
                        ),

                    updateQuantity: (productId, quantity) => {
                        if (quantity < 1) return;
                        set(
                            {
                                items: get().items.map((item) =>
                                    item._id === productId ? { ...item, quantity } : item
                                ),
                            },
                            false,
                            "cart/updateQuantity"  // ✅
                        );
                    },

                    clearCart: () => set({ items: [] }, false, "cart/clearCart"),  // ✅

                    getTotalPrice: () =>
                        get().items.reduce((total, item) => total + item.price * item.quantity, 0),

                    getTotalItems: () =>
                        get().items.reduce((total, item) => total + item.quantity, 0),
                }),
                {
                    name: "cart-storage",
                    storage: createJSONStorage(() => localStorage),
                }
            ),
            { name: "CartStore" }  // ✅ shows as "CartStore" in Redux DevTools extension
        )
    );
};