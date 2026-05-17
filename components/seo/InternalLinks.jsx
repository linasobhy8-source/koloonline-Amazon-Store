import Link from "next/link";

export default function InternalLinks({
  items = [],
  title = "Related Products",
}) {
  if (!items.length) return null;

  return (
    <section className="mt-12">
      <div className="border-t pt-6">
        <h2 className="text-2xl font-bold mb-6">
          {title}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item) => (
            <Link
              key={item.asin}
              href={`/product/${item.asin}`}
              className="border rounded-2xl p-4 hover:shadow-md transition"
            >
              <div className="font-semibold line-clamp-2">
                {item.title}
              </div>

              {item.price && (
                <div className="mt-2 text-sm text-gray-500">
                  ${item.price}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
