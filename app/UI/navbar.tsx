"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import CartDropdown from "./CartDropdown";

interface Props {
  categories: { name: string }[]; 
}

export default function Navbar({ categories }: Props) {
  const pathname = usePathname();

  const nav = [...categories.map((c) => c.name)];

  return (
    <div className="navbar shadow-lg p-4 mb-8 flex justify-between items-center bg-white">
      <div className="navigation flex space-x-4 text-lg font-medium text-gray-700 uppercase">
        {nav.map((slug) => (
          <Link
            key={slug}
            href={`/${slug === "all" ? "" : slug}`}
            className={clsx(
              "nav-link hover:text-gray-900",
              pathname === `/${slug === "all" ? "" : slug}` &&
                "active text-gray-900 font-bold"
            )}
          >
            {slug}
          </Link>
        ))}
      </div>
      <div className="logo-container text-2xl font-bold text-gray-900">
        <h1 className="logo">Logo</h1>
      </div>

      <CartDropdown />
    </div>
  );
}
