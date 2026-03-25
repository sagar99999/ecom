import Image from "next/image";
import Link from "next/link";

export default function Categories() {
    return (
        <div className="px-5 mb-10">
            <h2 className="text-2xl font-bold my-5">CATEGORIES</h2>
            <div className="flex gap-5 overflow-auto scrollbar-hide">
                <div className="relative shrink-0">
                    <Link href="/?category=bottoms">
                        <Image src="/images/bottoms.png" alt="tops category" width={300} height={300} />
                    </Link>
                    <div className="absolute left-8 bottom-2">
                        <p className="font-bold">CATEGORY</p>
                        <h3 className="font-bold text-2xl">BOTTOMS</h3>
                    </div>
                </div>
                <div className="relative shrink-0">
                    <Link href="/?category=shoes">
                        <Image src="/images/shoes.png" alt="tops category" width={300} height={300} />
                    </Link>
                    <div className="absolute left-8 bottom-2">
                        <p className="font-bold">CATEGORY</p>
                        <h3 className="font-bold text-2xl">SHOES</h3>
                    </div>
                </div>
                <div className="relative shrink-0">
                    <Link href="/?category=tops">
                        <Image src="/images/tops.png" alt="tops category" width={300} height={300} />
                    </Link>
                    <div className="absolute left-8 bottom-2">
                        <p className="font-bold">CATEGORY</p>
                        <h3 className="font-bold text-2xl">TOPS</h3>
                    </div>
                </div>
                <div className="relative shrink-0">
                    <Link href="/?category=bottoms">
                        <Image src="/images/bottoms.png" alt="tops category" width={300} height={300} />
                    </Link>
                    <div className="absolute left-8 bottom-2">
                        <p className="font-bold">CATEGORY</p>
                        <h3 className="font-bold text-2xl">BOTTOMS</h3>
                    </div>
                </div>
                <div className="relative shrink-0">
                    <Link href="/?category=shoes">
                        <Image src="/images/shoes.png" alt="tops category" width={300} height={300} />
                    </Link>
                    <div className="absolute left-8 bottom-2">
                        <p className="font-bold">CATEGORY</p>
                        <h3 className="font-bold text-2xl">SHOES</h3>
                    </div>
                </div>
                <div className="relative shrink-0">
                    <Link href="/?category=tops">
                        <Image src="/images/tops.png" alt="tops category" width={300} height={300} />
                    </Link>
                    <div className="absolute left-8 bottom-2">
                        <p className="font-bold">CATEGORY</p>
                        <h3 className="font-bold text-2xl">TOPS</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}