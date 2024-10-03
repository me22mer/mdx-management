"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  caption?: string;
};

export function MDXImage({ src, alt, caption }: Props) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = useCallback(() => {
    setIsFullScreen((prev) => !prev);
  }, []);

  return (
    <figure className="my-8">
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              `fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center backdrop-blur-lg`
            )}
            onClick={toggleFullScreen}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-[80%] max-h-auto ">
              <Image
                className="w-full h-auto object-contain rounded-xl shadow-lg border cursor-zoom-out"
                src={src}
                alt={alt}
                width={1200}
                height={900}
                quality={100}
                sizes="90vw"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="rounded-xl cursor-zoom-in overflow-hidden"
        transition={{ duration: 0.3 }}
        onClick={toggleFullScreen}>
        <Image
          className="w-full h-auto object-cover drop-shadow-lg rounded-xl transition-transform duration-300"
          src={src}
          alt={alt}
          width={800}
          height={600}
          quality={100}
          sizes="(min-width: 1024px) 800px, 100vw"
          priority
        />
        {caption && (
          <figcaption className="mt-2 text-center text-sm text-gray-600 italic">
            {caption}
          </figcaption>
        )}
      </motion.div>
    </figure>
  );
}
