import { PrismaClient } from "@prisma/client";
import { placeHolderData } from "@/app/lib/placeHolderData";

const prisma = new PrismaClient();


async function seedCategories() {
  await prisma.$transaction(
    placeHolderData.data.categories.map((c) =>
      prisma.category.upsert({
        where: { name: c.name },
        update: {},
        create: { name: c.name },
      })
    )
  );
}

async function seedProducts() {
  const products = placeHolderData.data.products;

  await prisma.$transaction(
    products.map((p) =>
      prisma.product.upsert({
        where: { id: p.id },
        update: {},
        create: {
          id: p.id,
          name: p.name,
          brand: p.brand,
          description: p.description,
          inStock: p.inStock,
          category: { connect: { name: p.category } },
        },
      })
    )
  );

  await prisma.productImage.createMany({
    data: products.flatMap((p) =>
      p.gallery.map((url) => ({
        productId: p.id,
        url: url.trim(),
      }))
    ),
    skipDuplicates: true,
  });

  await prisma.price.createMany({
    data: products.flatMap((p) =>
      p.prices.map((pr) => ({
        productId: p.id,
        amount: pr.amount,
        currencyLabel: pr.currency.label,
        currencySymbol: pr.currency.symbol,
      }))
    ),
    skipDuplicates: true,
  });
}

async function seedAttributes() {
  const products = placeHolderData.data.products;

  
  type SeedAttr = (typeof products)[0]["attributes"][0];
  type SeedItem = SeedAttr["items"][0];

  const attrMap = new Map<string, SeedAttr>();
  const itemMap = new Map<string, SeedItem & { attributeId: string }>();
  const prodAttrPairs: [string, string][] = [];

  for (const p of products) {
    for (const attr of p.attributes) {
      attrMap.set(attr.id, attr);
      for (const it of attr.items) {
        itemMap.set(it.id, { ...it, attributeId: attr.id });
      }
      prodAttrPairs.push([p.id, attr.id]);
    }
  }

  await prisma.$transaction(
    [...attrMap.values()].map((a) =>
      prisma.attribute.upsert({
        where: { id: a.id },
        update: {},
        create: { id: a.id, name: a.name, type: a.type },
      })
    )
  );

  if (itemMap.size)
    await prisma.attributeItem.createMany({
      data: [...itemMap.values()],
      skipDuplicates: true,
    });

  if (prodAttrPairs.length)
    await prisma.productAttribute.createMany({
      data: prodAttrPairs.map(([pid, aid]) => ({
        productId: pid,
        attributeId: aid,
      })),
      skipDuplicates: true,
    });
}

/* ---------- main ---------- */
export async function GET() {
  try {
    await seedCategories();
    await seedProducts();
    await seedAttributes();
    return Response.json({ message: "DB seeded with Prisma" });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Seeding failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
