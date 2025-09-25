'use client';

import { useVariantPrice } from '../hooks/useVariantPrice';



export default function PriceDisplay({ prices, selected }: Props) {
  const price = useVariantPrice(prices, selected);
  return (
    <div className="price flex justify-between items-center my-4 text-black">
      <h4 className="font-bold text-color-black">Price:</h4>
      <p data-testid="product-price" className="text-2xl font-bold text-color-black  " >
        {price.currencySymbol}
        {price.amount.toFixed(2)}
      </p>
    </div>
  );
}