

import Link from "next/link"
import { Mail, Phone, User } from "lucide-react"
import { currentUser } from "@clerk/nextjs/server";

export default async function TopNav() {

    const user = await currentUser();
    const isAdmin = user?.publicMetadata?.role === "admin";

    return (
        <div className="flex justify-end px-5 py-2 gap-5 bg-near-black">
            <div className="flex items-center">
                <Mail className="size-4 mr-1.5" />
                <p>
                    <Link className="text-xs font-normal" href="mailto://shaagar5@gmail.com">
                        shaagar5@gmail.com
                    </Link>
                </p>
            </div>
            <div className="flex items-center">
                <Phone className="size-4 mr-1.5" />
                <p>
                    <Link className="text-xs font-normal" href="tel:+9779818977981">
                        +977 9818977981
                    </Link>
                </p>
            </div>

            {isAdmin && (
                <div className="flex items-center">
                    <User className="size-4 mr-1.5" />
                    <p>
                        <Link className="text-xs font-normal" href="/admin">
                            Admin
                        </Link>
                    </p>
                </div>
            )}
        </div>
    )
}
