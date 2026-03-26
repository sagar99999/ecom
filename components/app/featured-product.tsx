"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import Link from "next/link"

export default function FeaturedProduct() {
  return (
    <div className="relative mb-5">
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
            stopOnMouseEnter: true
          }),
        ]}
        opts={{
          align: "start",
          loop: true,
        }}>
        <CarouselContent>
          <CarouselItem>
            <div className="relative">
              <Link href="/products/69c2a1ed20b5a419e31a91f4">
                <Image src="/images/hero2.jpg" style={{ height: "100%", width: "100%" }} height={639} width={1918} alt="hero image 1" />
              </Link>
            </div>
          </CarouselItem>

          <CarouselItem>
            <div className="relative">
              <Link href="/products/69c2a1ed20b5a419e31a91f4">
                <Image src="/images/hero3.jpg" style={{ height: "100%", width: "100%" }} height={639} width={1918} alt="hero image 1" />
              </Link>
            </div>
          </CarouselItem>

        </CarouselContent>
        <CarouselPrevious className="left-2 z-20 bg-brand-green cursor-pointer text-black border-0" />
        <CarouselNext className="right-2 z-20 bg-brand-green cursor-pointer text-black border-0" />
      </Carousel>
    </div>
  )
}