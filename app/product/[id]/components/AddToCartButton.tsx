interface Props {
  disabled: boolean;
  inStock: boolean;
}

export default function AddToCartButton({ disabled, inStock }: Props) {
  return (
    <button
      type="submit"
      className="add-to-cart-button bg-blue-600 text-white py-3 px-6 rounded disabled:opacity-50 hover:bg-blue-700 transition-colors w-full md:w-1/2"
      disabled={disabled}
    >
      {inStock ? 'Add to Cart' : 'Out of Stock'}
    </button>
  );
}