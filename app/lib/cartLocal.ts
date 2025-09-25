"use client";

const CART_KEY = "cart";

export interface CartItem {
  productId: string;
  name: string;
  imageUrl: string;
  prices: { amount: number; currencySymbol: string }[];
  selectedAttributes: Record<string, string>;
  quantity: number;
}

/* ---------- helpers ---------- */
export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

/* ---------- actions ---------- */
export function addToCart(
  product: any, // your Product type
  selectedAttributes: Record<string, string>,
  qty: number = 1
): void {
  const current = getCart();
  const exists = current.find(
    (i) =>
      i.productId === product.id &&
      JSON.stringify(i.selectedAttributes) ===
        JSON.stringify(selectedAttributes)
  );

  const imageUrl = product.images?.[0]?.url ?? "/placeholder.png";

  if (exists) {
    exists.quantity += qty;
  } else {
    current.push({
      productId: product.id,
      name: product.name,
      imageUrl, // ← store it
      prices: product.prices.map((p) => ({
        amount: p.amount,
        currencySymbol: p.currencySymbol,
      })),
      selectedAttributes,
      quantity: qty,
    });
  }
  saveCart(current);
  window.dispatchEvent(new Event("cart:updated"));
}

export function removeFromCart(
  productId: string,
  selectedAttributes: Record<string, string>
): void {
  const current = getCart();
  const filtered = current.filter(
    (i) =>
      i.productId !== productId ||
      JSON.stringify(i.selectedAttributes) !==
        JSON.stringify(selectedAttributes)
  );
  saveCart(filtered);
  window.dispatchEvent(new Event("cart:updated"));
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cart:updated"));
}
