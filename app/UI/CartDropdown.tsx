"use client";

import { useEffect, useState } from "react";
import { getCart, removeFromCart, clearCart } from "@/app/lib/cartLocal";
import Link from "next/link";
import Image from "next/image";

type CartItem = ReturnType<typeof getCart>[0];

export default function CartDropdown() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setItems(getCart());
    const onUpdate = () => setItems(getCart());
    window.addEventListener("cart:updated", onUpdate);
    return () => window.removeEventListener("cart:updated", onUpdate);
  }, []);

  const total = items.reduce((s, i) => s + i.prices[0].amount * i.quantity, 0);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring-1 inset-ring-white/5 hover:bg-white/20 hover:cursor-pointer"
      >
        Cart ({items.length})
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="#41fe00"
            d="M2.787 2.28a.75.75 0 0 1 .932.507l.55 1.863h14.655c1.84 0 3.245 1.717 2.715 3.51l-1.655 5.6c-.352 1.193-1.471 1.99-2.715 1.99H8.113c-1.244 0-2.362-.797-2.715-1.99L2.281 3.212a.75.75 0 0 1 .506-.931M6.25 19.5a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0m8 0a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-white/10 transition-all duration-150 data-[closed]:scale-95 data-[closed]:opacity-0">
          <div className="py-2">
            {items.length === 0 ? (
              <p className="px-4 py-2 text-sm text-gray-400">
                Your cart is empty
              </p>
            ) : (
              <>
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${JSON.stringify(
                      item.selectedAttributes
                    )}`}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-white/5"
                  >
                    <Image
                      src={item.imageUrl}
                      width={40}
                      height={40}
                      alt={item.name}
                      className="h-10 w-10 shrink-0 rounded object-cover"
                    />
                    <div className="flex-1 text-sm">
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-gray-300">
                        {item.quantity} × {item.prices[0].currencySymbol}
                        {item.prices[0].amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {Object.entries(item.selectedAttributes)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ")}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        removeFromCart(item.productId, item.selectedAttributes);
                        window.dispatchEvent(new Event("cart:updated"));
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                {/* Total + actions */}
                <div className="border-t border-white/10 px-4 py-3">
                  <div className="flex justify-between text-sm text-white">
                    <span>Total</span>
                    <span>
                      {items[0].prices[0].currencySymbol}
                      {total.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link
                      href="/Order"
                      className="w-full rounded bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-500"
                    >
                      Order
                    </Link>
                    <button
                      onClick={() => {
                        clearCart();
                        window.dispatchEvent(new Event("cart:updated"));
                      }}
                      className="w-full rounded bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
