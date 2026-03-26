"use client"

import { useCartStore } from "@/stores/cart-store-provider"
import { Box, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

type CartBtnProps = {
    id: string,
    imageUrl: string,
    name: string,
    price: number,
    category: string,
}

export default function CartBtn({ id, name, price, imageUrl, category }: CartBtnProps) {

    const addToCart = useCartStore((state) => state.addToCart);

    const handleAddToCart = () => {
        addToCart({
            _id: id,
            name,
            price,
            imageUrl,
            category,
        });
    };

    return (
        <Button onClick={handleAddToCart} className="bg-brand-green font-semibold h-12 cursor-pointer text-black w-full rounded-sm" asChild>
            <div className="flex items-center">
                <ShoppingBag className="size-4.5" />
                Add to Cart
            </div>
        </Button>
    )
}
