import { getProductsByCategory } from '@/app/lib/actions';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';





interface Props {
  category: 'tech' | 'clothes' | 'all'; 
}

export default async function CategoryPage({ category }: Props) {
  const products = await getProductsByCategory(category);

  return (
    <>
      <h1 className="catigoryName text-3xl font-bold bg-white p-4 text-gray-900 mt-0">
        {category === 'all' ? 'All Products' : `${category} Products`}
      </h1>

      <div className="products-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 mb-12">
        {products.map((p) => {
          const src = p.images[0]?.url ?? '/placeholder.png';
          const price = p.prices[0];

          return (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="product-card border p-4 rounded-lg hover:shadow-lg transition relative bg-white"
            >
              <div className="relative w-full h-100 mb-4 rounded-lg overflow-hidden  ">
                <Image
                  src={src}
                  alt={p.name}
                  width={300}
                  height={450}
                  className={clsx('w-full h-full object-cover', {
                    grayscale: !p.inStock,
                  })}
                />
                {!p.inStock && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-semibold text-sm pointer-events-none">
                    Out of Stock
                  </span>
                )}
              </div>
              <div className="product-info text-black">
                <h3>{p.name}</h3>
                <p>
                  {price?.currencySymbol}
                  {price?.amount.toFixed(2)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}