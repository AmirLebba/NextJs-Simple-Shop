"use client";
import { useState } from "react";
import ProductGallery from "./components/ProductGallery";
import ProductForm from "./components/ProductForm";
import AddToCartButton from "./components/AddToCartButton";
import PriceDisplay from "./components/PriceDisplay";
import Description from "./components/Description";
import { addToCart } from "@/app/lib/cartLocal";

type Product = NonNullable<
  Awaited<ReturnType<typeof import("@/app/lib/actions").getProductById>>
>;

export default function ProductClient({
  product,
  images,
}: {
  product: Product;
  images: string[];
}) {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const isAllSelected = product.attributes.every(
    (a) => selected[a.attribute.name]
  );

  const handleAddToCart = () => {
    addToCart(product, selected, 1);
    alert("Added to cart!");
  };

  return (
    <div className="product-page flex flex-col md:flex-row gap-10 bg-white p-4 rounded-lg mt-4 items-start justify-center shadow-lg shadow-gray-500/50 hover:shadow-lg hover:shadow-gray-500/50 transition-shadow duration-300 ease-in-out">
      <ProductGallery images={images} inStock={product.inStock} />
      <form
        className="product-options-form flex flex-col gap-4 max-w-md w-full md:w-1/2 bg-white p-4 rounded-lg shadow-lg shadow-gray-500/50 hover:shadow-lg hover:shadow-gray-500/50 transition-shadow duration-300 ease-in-out"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddToCart();
        }}
      >
        <h2 className="product-name text-2xl font-bold text-gray-900">
          {product.name}
        </h2>

        <ProductForm
          attributes={product.attributes}
          selected={selected}
          setSelected={setSelected}
        />

        <PriceDisplay prices={product.prices} selected={selected} />
        <AddToCartButton
          disabled={!isAllSelected || !product.inStock}
          inStock={product.inStock}
        />
        <Description description={product.description} />
      </form>
    </div>
  );
}
