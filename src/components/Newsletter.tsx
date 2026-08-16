export default function Newsletter() {
  return (
    <section className="mt-10 py-20 bg-boza-cream text-boza-black max-[640px]:py-14 max-[640px]:mt-6">
      <div className="container mx-auto px-6">
        <div className="max-w-[350px] mx-auto text-center max-[640px]:max-w-full">
          <h2 className="font-display text-2xl font-black mb-4 max-[640px]:text-xl">
            LE PLUS BOZA DE LA <br />
            SAISON <br />
            Abonne-toi à notre newsletter
          </h2>
          <p className="text-xs mb-10 text-boza-taupe max-[640px]:mb-7">
            Abonne-toi à notre newsletter pour recevoir en avant-première toutes les nouveautés, lancements et promotions.
          </p>
          <form className="flex flex-col items-stretch gap-4 max-w-[500px] mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-3 py-2 border border-boza-black bg-boza-cream text-boza-black font-body placeholder:text-boza-taupe min-w-0"
            />
            <button
              type="submit"
              className="bg-boza-black text-boza-cream px-3 py-2 border border-boza-black font-semibold transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown cursor-pointer whitespace-nowrap"
            >
              S&apos;inscrire
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}