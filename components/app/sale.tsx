import Card from "./card"
import dbConnect from "@/lib/dbConnect"
import Product from "@/models/product"

export const dynamic = "force-dynamic";

export default async function Sale() {
    await dbConnect();

    const products = await Product.find().lean();

    return products.length ? (
        <div className="px-5 mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 gap-y-8">
                {
                    products.map(prod => <Card category={prod.category} _id={prod._id.toString()} key={prod._id.toString()} quantity={prod.quantity} img={prod.imageUrl} productName={prod.name} productPrice={prod.price} />)
                }
            </div>
        </div>
    ) : null
}