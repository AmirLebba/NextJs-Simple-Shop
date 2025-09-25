"use client";
import Image from "next/image";
import { useState } from "react";
import { useEffect, useRef } from "react";
import clsx from "clsx";

interface Props {
  images: string[];
  inStock: boolean;
}

export default function ProductGallery({ images, inStock }: Props) {
  const [idx, setIdx] = useState(0);
  const change = (dir: number) =>
    setIdx((i) => (i + dir + images.length) % images.length);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    thumbRefs.current[idx]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [idx]);

  return (
    <div
      className="product-gallery flex gap-4 items-center"
      data-testid="product-gallery"
    >
      <div className="gallery-thumbnails flex flex-col gap-2 overflow-y-auto h-96 mb-2 max-h-500">
        {images.map((src, i) => (
          <button
            ref={(el) => {
              thumbRefs.current[i] = el;
            }}
            key={i}
            onClick={() => setIdx(i)}
            aria-pressed={i === idx}
            className={clsx(
              "relative shrink-0 rounded-md overflow-hidden outline-none",
              "focus:ring-2 focus:ring-blue-500",
              i === idx
                ? "ring-2 ring-blue-600" // active highlight
                : "ring-1 ring-gray-200 hover:ring-gray-400"
            )}
          >
            <Image
              src={src}
              alt={`Product ${i}`}
              width={79}
              height={80}
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <div className="gallery-main relative flex items-center">
        <button
          className="absolute top-1/2 left-1 translate-y-[-50%] bg-black color-white cursor-pointer p-2 z-10"
          onClick={() => change(-1)}
        >
          ❮
        </button>
        <div className="relative mb-4 rounded-lg overflow-hidden w-auto h-[570px]">
          <Image
            src={images[idx]}
            alt={`Product ${idx}`}
            width={478}
            height={570}
            className={clsx("w-full h-full object-cover", {
              grayscale: !inStock,
            })}
            priority // ← important for LCP
          />
          {!inStock && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-semibold text-sm pointer-events-none">
              Out of Stock
            </span>
          )}
        </div>
        <button
          className="absolute top-1/2 right-1 translate-y-[-50%] bg-black color-white cursor-pointer p-2 z-10"
          onClick={() => change(1)}
        >
          ❯
        </button>
      </div>
    </div>
  );
}
