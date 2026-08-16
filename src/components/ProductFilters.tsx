"use client";

type ProductFiltersProps = {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
};

export default function ProductFilters({ categories, active, onChange }: ProductFiltersProps) {
  const allCategories = ["Tous", ...categories];

  return (
    <section className="bg-boza-cream py-[15px] mb-10">
      <div className="container mx-auto flex flex-wrap justify-center">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`font-body text-sm font-normal py-[5px] px-[15px] border border-boza-black m-[5px] transition-all duration-300 cursor-pointer ${
              active === cat
                ? "bg-boza-brown text-boza-cream"
                : "bg-boza-cream text-boza-black hover:bg-boza-brown hover:text-boza-cream"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
}