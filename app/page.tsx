import Categories from "@/components/app/categories";
import FeaturedProduct from "@/components/app/featured-product";
import Sale from "@/components/app/sale";

export default function Home() {
  return <>
    <main>
      <FeaturedProduct />
      <Categories />
      <h2 className="text-2xl font-bold my-5 px-5">PRODUCTS</h2>
      <Sale />
    </main>
  </>
}