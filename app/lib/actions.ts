/* ./app/lib/actions.ts */
import { prisma } from "@/app/lib/prisma";

export type Product = Awaited<ReturnType<typeof getProductById>>;

/* 1.  everything about every product */
export async function getAllProducts() {
  return prisma.product.findMany({
    include: {
      images: true,
      prices: true,
      attributes: { include: { attribute: { include: { items: true } } } },
    },
  });
}

/* 2.  products filtered by category (tech | clothes) */
export async function getProductsByCategory(
  categoryName: "tech" | "clothes" | "all"
) {
  if (categoryName === "all") return getAllProducts(); // ← re-use existing query

  return prisma.product.findMany({
    where: { categoryName },
    include: {
      images: true,
      prices: true,
      attributes: { include: { attribute: { include: { items: true } } } },
    },
  });
}

/* 3.  simple list of all category names */
export async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}


/* 4.  single product + full details */
export async function getProductById(id?: string) {
  if (!id || typeof id !== "string") return null; 

  return prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      prices: true,
      attributes: { include: { attribute: { include: { items: true } } } },
    },
  });
}
