"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image";
import { Search, ShoppingBag, Menu, Trash2, Plus, Minus, Package } from "lucide-react";
import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs"
import { useCartStore } from "@/stores/cart-store-provider"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerFooter,
    DrawerClose,
} from "@/components/ui/drawer"

export default function Navbar() {

    const router = useRouter()

    const totalItems = useCartStore((state) => state.getTotalItems());
    const totalPrice = useCartStore((state) => state.getTotalPrice());
    const items = useCartStore((state) => state.items);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const clearCart = useCartStore((state) => state.clearCart);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className="px-5 py-4 flex items-center">
            <div className="flex items-center">
                <Button className="bg-transparent cursor-pointer mr-1">
                    <Menu className="size-6" />
                </Button>
                <Link href="/">
                    <Image
                        src="/images/logo.png"
                        alt="brand logo"
                        style={{ width: "5rem", height: "auto" }}
                        height={150}
                        width={150}
                    />
                </Link>
            </div>

            <div className="flex ml-auto items-center gap-3 justify-end">
                <Button className="bg-transparent cursor-pointer">
                    <Search className="size-6" />
                </Button>

                {/* Cart Drawer */}
                <Drawer direction="right">
                    <DrawerTrigger asChild>
                        <Button className="relative bg-transparent mr-2 cursor-pointer">
                            <ShoppingBag className="size-6" />
                            {isMounted && totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full size-5 flex items-center justify-center">
                                    {totalItems > 99 ? "99+" : totalItems}
                                </span>
                            )}
                        </Button>
                    </DrawerTrigger>

                    <DrawerContent className="h-full w-95 mt-0 border-none! bg-near-black text-white rounded-none!">
                        <DrawerHeader className="pb-4">
                            <DrawerTitle className="text-xl text-white font-bold">
                                Your Cart ({totalItems})
                            </DrawerTitle>
                        </DrawerHeader>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto px-4 bg-near-black py-4 space-y-4">
                            {!isMounted || items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                                    <ShoppingBag className="size-12 opacity-30" />
                                    <p className="text-sm">Your cart is empty</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item._id} className="flex items-center gap-3 rounded-sm p-2">
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.name}
                                            width={100}
                                            height={100}
                                            className="rounded-sm object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate mb-1">{item.name}</p>
                                            <p className="text-sm font-semibold text-muted-foreground">${item.price}</p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    className="size-4 rounded-full border flex items-center justify-center hover:bg-white hover:text-black cursor-pointer"
                                                >
                                                    <Minus className="size-2" />
                                                </button>
                                                <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    className="size-4 rounded-full border flex items-center justify-center hover:bg-white hover:text-black cursor-pointer"
                                                >
                                                    <Plus className="size-2" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Item total + remove */}
                                        <div className="flex flex-col items-end gap-2">
                                            <p className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {isMounted && items.length > 0 && (
                            <DrawerFooter className="pt-4 gap-3">
                                <div className="flex items-center justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <DrawerClose asChild>
                                    <Link href="/checkout">
                                        <Button className="bg-brand-green text-black w-full rounded-sm h-11 cursor-pointer font-bold">
                                            Checkout
                                        </Button>
                                    </Link>
                                </DrawerClose>
                                <button
                                    onClick={clearCart}
                                    className="text-sm text-muted-foreground hover:text-red-500 cursor-pointer text-center"
                                >
                                    Clear cart
                                </button>
                            </DrawerFooter>
                        )}
                    </DrawerContent>
                </Drawer>

                <Show when="signed-out">
                    <SignInButton mode="modal">
                        <Button className="bg-brand-green px-4 rounded-sm text-black cursor-pointer">
                            Sign In
                        </Button>
                    </SignInButton>
                </Show>
                <Show when="signed-in">
                    <UserButton>
                        <UserButton.MenuItems>
                            <UserButton.Action
                                label="Orders"
                                labelIcon={<Package className="size-4" />}
                                onClick={() => router.push("/orders")}
                            />
                        </UserButton.MenuItems>
                    </UserButton>
                </Show>
            </div>
        </div>
    )
}