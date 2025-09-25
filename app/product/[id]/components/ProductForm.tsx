"use client";
import clsx from "clsx";
import type { Product } from "@/app/lib/actions";

// pick the real shape you are passing
type Attr = NonNullable<Product>["attributes"][0];

interface Props {
  attributes: Attr[];
  selected: Record<string, string>;
  setSelected: (v: Record<string, string>) => void;
}

export default function ProductForm({
  attributes,
  selected,
  setSelected,
}: Props) {
  return (
    <>
      {attributes.map((attr) => {
        const attrName = attr.attribute.name;
        return (
          <fieldset key={attrName} className="attribute-group …">
            <legend className="attribute-name font-bold text-lg">
              {attrName}:
            </legend>
            <div className="attribute-options flex gap-2 flex-wrap">
              {attr.attribute.items.map((item) => {
                const isSel = selected[attrName] === item.value;
                return (
                  <button
                    type="button"
                    key={item.id}
                    aria-pressed={isSel}
                    title={item.displayValue}
                    className={clsx(
                      "attribute-option px-4 py-2 border border-gray-300 cursor-pointer bg-white text-gray-900 hover:bg-gray-100 transition-colors",
                      { "selected bg-black border-solid border-sky-500": isSel }
                    )}
                    style={
                      attr.attribute.type === "swatch"
                        ? { backgroundColor: item.value }
                        : {}
                    }
                    onClick={() =>
                      setSelected({ ...selected, [attrName]: item.value })
                    }
                  >
                    {attr.attribute.type !== "swatch" ? item.displayValue : ""}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </>
  );
}
