import parse from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';

interface Props {
  description: string;
}

export default function Description({ description }: Props) {
  return (
    <div className="product-description mt-4 text-black">
      {parse(DOMPurify.sanitize(description))}
    </div>
  );
}