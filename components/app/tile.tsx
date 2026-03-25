"use client"
import Image from "next/image"
import { Box, CircleChevronRight } from "lucide-react"
import Link from "next/link"

type TileProps = {
    name: string,
    price: number,
    category: string,
    imageUrl: string,
    quantity: number,
    id: string
}

export default function Tile({ name, price, id, category, imageUrl, quantity }: TileProps) {
    return (
        <Link href={`/admin/update/${id}`}>
            <div className="flex mb-5 p-2 relative bg-near-black border-2 rounded-lg border-[#252525]">
                <Image className="rounded-sm" style={{ width: "10rem", height: "auto" }} src={imageUrl} alt={name} height={300} width={300} />
                <div className="ml-5">
                    <h2 className="font-bold text-lg mb-1">{name}</h2>
                    <p className="font-semibold mb-1">${price}</p>
                    <p className="mb-2 text-center font-semibold text-xs flex items-center">
                        <Box className="size-3 mr-0.5" />
                        {quantity}</p>
                    <p className="bg-brand-green inline-block px-2 py-0.5 text-xs font-bold rounded-xl text-black text-center mr-3">{category}</p>
                    <CircleChevronRight className="size-7 text-[#252525] absolute top-[50%] right-2 translate-y-[-50%]" />
                </div>
            </div>
        </Link>
    )
}
