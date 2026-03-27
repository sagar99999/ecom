import dbConnect from '@/lib/dbConnect'
import Product from "@/models/product"
import Tile from '@/components/app/tile';
import { CirclePlus } from "lucide-react"
import Link from "next/link"
import type { Metadata } from 'next'

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: 'Ecommerce | Products',
    description: 'your products',
}

export default async function Admin() {

    await dbConnect()

    const products = await Product.find().lean();

    return (
        <div className="max-w-150 px-5 mb-15 mx-auto">
            <div className='flex items-center justify-between'>
                <h1 className="text-lg font-bold mb-4">All Products</h1>
                <Link href="/admin/add">
                    <CirclePlus className="size-6" />
                </Link>
            </div>
            <div>
                {
                    products.length ? products.map(prod => <Tile name={prod.name} price={prod.price} quantity={prod.quantity} category={prod.category} id={prod._id.toString()} imageUrl={prod.imageUrl} key={prod._id.toString()} />) : null
                }
            </div>
        </div>
    )
}
