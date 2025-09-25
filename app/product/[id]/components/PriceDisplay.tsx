'use client';
import { useVariantPrice } from '../hooks/useVariantPrice';
import type { Price } from '@prisma/client';

interface Props {
  prices: Price[];
  selected: Record<string, string>;
}

export default function PriceDisplay({ prices, selected }: Props) {
  const price = useVariantPrice(prices, selected);
  return (
    <div className="price flex justify-between items-center my-4 text-black">
      <h4 className="font-bold text-black">Price:</h4>
      <p data-testid="product-price" className="text-2xl font-bold text-black">
        {price.currencySymbol}
        {price.amount.toFixed(2)}
      </p>
    </div>
  );
}