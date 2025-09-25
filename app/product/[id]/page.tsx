import { getProductById } from "@/app/lib/actions";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  /* remove duplicates (if any) */
  const uniqueImages = Array.from(
    new Map(product.images.map((i) => [i.url, i])).values()
  );

  return (
    <ProductClient product={product} images={uniqueImages.map((i) => i.url)} />
  );
}
