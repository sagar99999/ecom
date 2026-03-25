import { Truck, ShieldCheck, Headset } from "lucide-react"

export default function BottomInfo() {
    return (
        <div className="flex justify-center gap-12 p-1 py-10 bg-near-black">
            <div className="text-center">
                <Truck className="size-6 mb-1 inline-block" />
                <h6 className="font-semibold text-sm mb-1">Shipping</h6>
                <p className="text-xs">We ship all over Nepal</p>
            </div>
            <div className="text-center">
                <ShieldCheck className="size-6 mb-1 inline-block" />
                <h6 className="font-semibold text-sm mb-1">Payment</h6>
                <p className="text-xs">Make secure payments</p>
            </div>
            <div className="text-center">
                <Headset className="size-6 mb-1 inline-block" />
                <h6 className="font-semibold text-sm mb-1">Support</h6>
                <p className="text-xs">24/7 assistance</p>
            </div>
        </div>
    )
}
