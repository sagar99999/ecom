"use client"
import Image from "next/image"
import { Button } from "../ui/button"
import { ShoppingBag, Box } from "lucide-react"
import Link from "next/link"
import { useCartStore } from "@/stores/cart-store-provider"

type CardProps = {
    _id: string,
    img: string,
    productName: string,
    productPrice: number,
    quantity: number,
    category: string,  // ✅ add this
}

export default function Card({ _id, img, productName, productPrice, quantity, category }: CardProps) {
    const addToCart = useCartStore((state) => state.addToCart);

    const handleAddToCart = () => {
        addToCart({
            _id,
            name: productName,
            price: productPrice,
            imageUrl: img,      // ✅ mapped from img -> imageUrl
            category,
        });
    };

    return (
        <div>
            <Link href={`/products/${_id}`}>
                <Image className="mb-5 mx-auto rounded-sm" src={img} alt={productName} height={300} width={300} />
                <h4 className="text-xl mb-3 text-center font-bold">{productName}</h4>
                <div className="flex items-center justify-between">
                    <p className="mb-3 text-lg text-center font-bold">${productPrice}</p>
                    <p className="mb-3 text-center font-semibold flex items-center">
                        <Box className="size-4 mr-0.5" />
                        {quantity}
                    </p>
                </div>
            </Link>
            <Button
                onClick={handleAddToCart}  // ✅ fixed
                className="bg-brand-green h-11 cursor-pointer text-black w-full rounded-sm"
            >
                <ShoppingBag className="size-4.5" />
                Add to Cart
            </Button>
        </div>
    )
}