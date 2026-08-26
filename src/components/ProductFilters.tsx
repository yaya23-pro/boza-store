import Link from "next/link";
import { Category } from "@/lib/catalogue";

type ProductFiltersProps = {
  categories: Category[];
  activeSlug: string | null;
};

export default function ProductFilters({ categories, activeSlug }: ProductFiltersProps) {
  return (
    <section className="bg-boza-cream py-[15px] mb-10">
      <div className="container mx-auto flex flex-wrap justify-center">
        <Link
          href="/catalogue"
          className={`font-body text-sm font-normal py-[5px] px-[15px] border border-boza-black m-[5px] transition-all duration-300 inline-block ${
            activeSlug === null
              ? "bg-boza-brown text-boza-cream"
              : "bg-boza-cream text-boza-black hover:bg-boza-brown hover:text-boza-cream"
          }`}
        >
          Tous
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/catalogue/${cat.slug}`}
            className={`font-body text-sm font-normal py-[5px] px-[15px] border border-boza-black m-[5px] transition-all duration-300 inline-block ${
              activeSlug === cat.slug
                ? "bg-boza-brown text-boza-cream"
                : "bg-boza-cream text-boza-black hover:bg-boza-brown hover:text-boza-cream"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </section>
  );
}