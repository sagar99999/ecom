// app/checkout/page.tsx
"use client"
import { SubmitHandler, useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Loader2, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/stores/cart-store-provider"
import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"

type CheckoutFormType = {
    name: string
    email: string
    phone: string
    street: string
    city: string
    state: string
    zipCode: string
    notes: string
}

export default function CheckoutPage() {
    const router = useRouter()
    const items = useCartStore((state) => state.items)
    const totalPrice = useCartStore((state) => state.getTotalPrice())
    const totalItems = useCartStore((state) => state.getTotalItems())
    const clearCart = useCartStore((state) => state.clearCart)
    const [isMounted, setIsMounted] = useState(false)

    // Get Clerk user data
    const { user, isLoaded: isUserLoaded } = useUser()

    // Extract user email and name
    const userEmail = user?.primaryEmailAddress?.emailAddress || ""
    const userName = user?.fullName || ""

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<CheckoutFormType>({
        defaultValues: {
            name: userName,
            email: userEmail,
        }
    })

    // Update form values when user data is available
    useEffect(() => {
        if (isUserLoaded && user) {
            setValue("name", userName)
            setValue("email", userEmail)
        }
    }, [isUserLoaded, user, setValue, userName, userEmail])

    const onSubmit: SubmitHandler<CheckoutFormType> = async (data) => {
        try {
            const payload = {
                orderItems: items.map((item) => ({
                    product: item._id,
                    quantity: item.quantity,
                    priceAtPurchase: item.price,
                })),
                customer: {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    address: {
                        street: data.street,
                        city: data.city,
                        state: data.state,
                        zipCode: data.zipCode,
                        // country field removed
                    },
                },
                totalAmount: totalPrice,
                paymentMethod: "cash_on_delivery",
                notes: data.notes,
            }

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error("Failed to place order")

            clearCart()
            toast.success("Order Placed!", {
                description: "Your order has been placed successfully.",
            })
            router.push("/orders")
        } catch (error: any) {
            toast.error("Order Failed", {
                description: error.message,
            })
        }
    }

    // Wait for user data to load before rendering the form
    if (!isUserLoaded || !isMounted) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <ShoppingBag className="size-12 opacity-20" />
                <p className="text-xl font-semibold text-muted-foreground">Your cart is empty</p>
                <Button
                    onClick={() => router.push("/")}
                    className="bg-brand-green text-black px-5 h-10 cursor-pointer"
                >
                    Continue Shopping
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-6xl px-5 py-10 mb-15 mx-auto">
            <h1 className="text-lg font-bold mb-4">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* LEFT — Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">

                    {/* Customer Info */}
                    <h2 className="mb-4 font-semibold text-muted-foreground">Customer Information</h2>

                    <div className="mb-7">
                        <label className="text-sm mb-2 block" htmlFor="name">Full Name *</label>
                        <Input
                            id="name"
                            className="h-11 bg-near-black border-2 border-[#252525]"
                            placeholder="John Doe"
                            {...register("name", {
                                required: "Full name is required",
                                minLength: { value: 3, message: "Provide a valid name" },
                            })}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-4">{errors.name.message}</p>}
                    </div>

                    <div className="mb-7">
                        <label className="text-sm mb-2 block" htmlFor="email">Email *</label>
                        <Input
                            id="email"
                            type="email"
                            className="h-11 bg-near-black border-2 disabled:bg-near-black border-[#252525]"
                            placeholder="john@example.com"
                            readOnly
                            disabled
                            {...register("email", {
                                required: "Email is required",
                                pattern: { value: /^\S+@\S+$/i, message: "Provide a valid email" },
                            })}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-4">{errors.email.message}</p>}
                    </div>

                    <div className="mb-7">
                        <label className="text-sm mb-2 block" htmlFor="phone">Phone *</label>
                        <Input
                            id="phone"
                            type="tel"
                            className="h-11 bg-near-black border-2 border-[#252525]"
                            placeholder="+977 980 111 2223"
                            {...register("phone", {
                                required: "Phone number is required",
                                minLength: { value: 7, message: "Provide a valid phone number" },
                            })}
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-4">{errors.phone.message}</p>}
                    </div>

                    {/* Shipping Address */}
                    <h2 className="text-sm font-bold mb-4 uppercase tracking-widest text-muted-foreground">Shipping Address</h2>

                    <div className="mb-7">
                        <label className="text-sm mb-2 block" htmlFor="street">Street Address *</label>
                        <Input
                            id="street"
                            className="h-11 bg-near-black border-2 border-[#252525]"
                            placeholder="New Road"
                            {...register("street", {
                                required: "Street address is required",
                            })}
                        />
                        {errors.street && <p className="text-red-500 text-sm mt-4">{errors.street.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-7">
                        <div>
                            <label className="text-sm mb-2 block" htmlFor="city">City *</label>
                            <Input
                                id="city"
                                className="h-11 bg-near-black border-2 border-[#252525]"
                                placeholder="Kathmandu"
                                {...register("city", { required: "City is required" })}
                            />
                            {errors.city && <p className="text-red-500 text-sm mt-4">{errors.city.message}</p>}
                        </div>
                        <div>
                            <label className="text-sm mb-2 block" htmlFor="state">State *</label>
                            <Input
                                id="state"
                                className="h-11 bg-near-black border-2 border-[#252525]"
                                placeholder="Bagmati"
                                {...register("state", { required: "State is required" })}
                            />
                            {errors.state && <p className="text-red-500 text-sm mt-4">{errors.state.message}</p>}
                        </div>
                    </div>

                    {/* Zip Code only - Country field removed */}
                    <div className="mb-7">
                        <label className="text-sm mb-2 block" htmlFor="zipCode">Zip Code *</label>
                        <Input
                            id="zipCode"
                            className="h-11 bg-near-black border-2 border-[#252525]"
                            placeholder="44600"
                            {...register("zipCode", { required: "Zip code is required" })}
                        />
                        {errors.zipCode && <p className="text-red-500 text-sm mt-4">{errors.zipCode.message}</p>}
                    </div>

                    {/* Order Notes */}
                    <div className="mb-7">
                        <label className="text-sm mb-2 block" htmlFor="notes">Order Notes (Optional)</label>
                        <Textarea id="notes"
                            className="bg-near-black border-2 border-[#252525] resize-none"
                            placeholder="Any special instructions for your order..."
                            rows={4}
                            {...register("notes")}
                        />
                    </div>

                    {/* Submit — hidden on mobile, shown on desktop */}
                    <div className="hidden lg:block">
                        <Button
                            disabled={isSubmitting}
                            type="submit"
                            className="bg-brand-green text-black w-full h-12 cursor-pointer font-bold"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="size-4 mr-2 animate-spin" />
                                    Placing Order...
                                </>
                            ) : (
                                "Place Order"
                            )}
                        </Button>
                    </div>
                </form>

                {/* RIGHT — Order Summary */}
                <div>
                    <h2 className="mb-4 font-semibold text-muted-foreground">Order Summary</h2>

                    <div className="border-2 border-[#252525] bg-near-black p-5 space-y-4">

                        {/* Items */}
                        <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                            {items.map((item) => (
                                <div key={item._id} className="flex items-center gap-3">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        width={100}
                                        height={100}
                                        className="object-cover rounded-sm"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="mb-1 font-semibold truncate">{item.name}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <hr className="border-[#252525]" />

                        {/* Totals */}
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="text-brand-green font-semibold">Free</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment</span>
                                <span>Cash on Delivery</span>
                            </div>
                        </div>

                        <hr className="border-[#252525]" />

                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Submit on mobile */}
                    <div className="mt-4 lg:hidden">
                        <Button
                            disabled={isSubmitting}
                            onClick={handleSubmit(onSubmit)}
                            className="bg-brand-green text-black w-full h-12 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="size-4 mr-2 animate-spin" />
                                    Placing Order...
                                </>
                            ) : (
                                "Place Order"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}