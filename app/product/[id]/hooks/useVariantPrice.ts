import type { Product } from '@/app/lib/actions';

export function useVariantPrice(
  prices: Product['prices'],
  selected: Record<string, string>
) {
  const variantKey = Object.values(selected).sort().join('|');
  return prices.find((p: any) => p.variantKey === variantKey) ?? prices[0];
}