// store/cartStoreProvider.tsx
"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStore } from "zustand";
import { createCartStore, type CartStore, defaultInitState, type CartState } from "./cart-store";

type CartStoreApi = ReturnType<typeof createCartStore>;

const CartStoreContext = createContext<CartStoreApi | undefined>(undefined);

export const CartStoreProvider = ({
    children,
    initState,
}: {
    children: ReactNode;
    initState?: CartState;
}) => {
    const storeRef = useRef<CartStoreApi | null>(null);

    if (storeRef.current === null) {
        storeRef.current = createCartStore(initState ?? defaultInitState);
    }

    return (
        <CartStoreContext.Provider value={storeRef.current}>
            {children}
        </CartStoreContext.Provider>
    );
};

export const useCartStore = <T,>(selector: (store: CartStore) => T): T => {
    const cartStoreContext = useContext(CartStoreContext);
    if (!cartStoreContext) throw new Error("useCartStore must be used within CartStoreProvider");
    return useStore(cartStoreContext, selector);
};