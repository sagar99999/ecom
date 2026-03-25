import dbConnect from '@/lib/dbConnect'
import Order from '@/models/order'
import OrderTile from '@/components/app/order-tile'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const dynamic = "force-dynamic"

export default async function AdminOrders() {
    await dbConnect()

    const orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate('orderItems.product', 'imageUrl name')
        .lean()

    const plainOrders = orders.map(order => ({
        _id: order._id.toString(),
        totalAmount: order.totalAmount,
        status: order.status,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : null,
        orderItemsCount: order.orderItems.length,
        imageUrl: order.orderItems[0]?.product?.imageUrl || null,
    }))

    return (
        <div className="max-w-150 px-5 mb-15 mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-bold mb-4">All Orders</h1>
            </div>
            <div className="mb-7">
                {plainOrders.length ? (
                    plainOrders.map((order) => (
                        <OrderTile
                            key={order._id}
                            id={order._id}
                            totalAmount={order.totalAmount}
                            status={order.status}
                            paymentMethod={order.paymentMethod}
                            createdAt={order.createdAt}
                            orderItemsCount={order.orderItemsCount}
                            imageUrl={order.imageUrl}
                        />
                    ))
                ) : (
                    <p className="text-muted-foreground text-center py-10">
                        No orders found.
                    </p>
                )}
            </div>
            <Link className='text-center block mx-auto' href="/">
                <Button
                    className="bg-brand-green text-black px-5 h-10 cursor-pointer"
                >
                    Continue Shopping
                </Button>
            </Link>
        </div>
    )
}