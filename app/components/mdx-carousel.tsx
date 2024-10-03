"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "./ui/carousel";
import { Card, CardContent } from "./ui/card";



interface CarouselProps {
  images: string[];
  caption?: string;
}

export function MDXCarousel({ images, caption }: CarouselProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <figure className="w-full">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
        className="w-full max-w-full mx-auto"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}>
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <Card className="rounded-xl border-none ">
                <CardContent className="p-0 aspect-video rounded-xl">
                  <div className="relative w-full h-full">
                    <Image
                      src={src}
                      alt={`Slide ${index + 1}`}
                      fill
                      priority
                      quality={100}
                      sizes="(max-width: 1024px), 100vw"
                      className="object-cover m-0 w-full h-full rounded-xl"
                    />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-600 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
