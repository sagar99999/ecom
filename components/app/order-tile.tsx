"use client"
import { CircleChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"

type OrderTileProps = {
    id: string
    totalAmount: number
    status: string
    paymentMethod: string
    createdAt: string | null
    orderItemsCount: number
    imageUrl?: string | null
}

export default function OrderTile({
    id,
    totalAmount,
    status,
    paymentMethod,
    createdAt,
    orderItemsCount,
    imageUrl,
}: OrderTileProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-600/20 text-yellow-400 border-yellow-600"
            case "confirmed":
                return "bg-blue-600/20 text-blue-400 border-blue-600"
            case "shipped":
                return "bg-purple-600/20 text-purple-400 border-purple-600"
            case "delivered":
                return "bg-green-600/20 text-green-400 border-green-600"
            case "cancelled":
                return "bg-red-600/20 text-red-400 border-red-600"
            default:
                return "bg-gray-600/20 text-gray-400 border-gray-600"
        }
    }

    return (
        <div className="flex mb-5 p-2 relative bg-near-black border-2 rounded-lg border-[#252525]">
            {imageUrl && (
                <Image className="rounded-sm" style={{ width: "10rem", height: "auto" }} src={imageUrl} alt={id} height={300} width={300} />
            )}
            <div className="flex-1 min-w-0 ml-5">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h2 className="font-bold text-lg mb-1">Order #{id.slice(-8)}</h2>
                    <span
                        className={`text-xs px-2 py-1 rounded-full border-0 bg-green-700`}
                    >
                    success
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {createdAt ? format(new Date(createdAt), "PPP") : "—"}
                    </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <span className="font-semibold">
                        ${totalAmount.toFixed(2)}
                    </span>
                    <span className="text-center font-semibold text-xs flex items-center">
                        {orderItemsCount} item(s)
                    </span>
                    <span className="text-center font-semibold text-xs flex items-center text-muted-foreground">
                        {paymentMethod === "cash_on_delivery"
                            ? "Cash on Delivery"
                            : paymentMethod}
                    </span>
                </div>
            </div>
            <CircleChevronRight className="size-7 text-[#252525] absolute top-[50%] right-2 translate-y-[-50%]" />
        </div>
    )
}