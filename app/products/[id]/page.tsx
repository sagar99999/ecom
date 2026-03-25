import dbConnect from "@/lib/dbConnect"
import Product from "@/models/product"
import Image from "next/image"
import { Box, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

type ProductProps = {
    params: Promise<
        {
            id: string
        }>
}

export default async function ProductPage({ params }: ProductProps) {
    const { id } = await params

    await dbConnect();

    const product = await Product.findOne({ _id: id }).lean();

    return product ? (
        <div className="text-center max-w-120 mx-auto mb-15 px-5">
            <Image className="mb-5  mx-auto rounded-sm" src={product.imageUrl} alt="tshirt" height={400} width={400} />
            <h2 className="text-3xl mb-3 text-center font-bold">{product.name}</h2>
            <div className="flex items-center justify-center">
                <p className="mb-3 text-2xl text-center font-bold mr-3">${product.price}</p>
                <p className="mb-3 text-center font-semibold flex items-center">
                    <Box className="size-4 mr-0.5" />
                    {product.quantity}</p>
                    <p className="mb-3 ml-3 bg-brand-green text-xs font-bold rounded-xl py-1 px-3 text-black text-center mr-3">{product.category}</p>
            </div>
            <p className="mb-5 p-4 rounded-lg bg-near-black border-2 border-[#252525]">{product.description}</p>
            <Button className="bg-brand-green font-semibold h-12 cursor-pointer text-black w-full rounded-sm" asChild>
                <div className="flex items-center">
                    <ShoppingBag className="size-4.5" />
                    Buy
                </div>
            </Button>
        </div>
    ) : null
}
