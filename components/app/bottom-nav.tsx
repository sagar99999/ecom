import Link from "next/link"
import { Mail, Phone, MapPin, Instagram, Youtube } from "lucide-react"

export default function BottomNav() {
    return (
        <div className="flex justify-between px-5 py-5">
            <p className="text-sm">&copy; Copyright 2026. All rights reserved.</p>
            <div className="flex items-center gap-3">
                <Link href="tel:9779818977981">
                    <Phone className="size-4" />
                </Link>
                <Link href="mailto://shaagar5@gmail.com">
                    <Mail className="size-4" />
                </Link>
                <MapPin className="size-4" />
                <Instagram className="size-4" />
                <Youtube className="size-4" />
            </div>
        </div>
    )
}
