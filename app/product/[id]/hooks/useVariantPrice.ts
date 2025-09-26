import type { Price } from "@prisma/client";

export function useVariantPrice(
  prices: Price[],
  selected: Record<string, string>
): Price {
  const variantKey = Object.values(selected).sort().join("|");
  return (
    prices.find(
      (p) => (p as Price & { variantKey?: string }).variantKey === variantKey
    ) ?? prices[0]
  );
}
