export default function SaleBanner() {
  return (
    <section className="bg-boza-brown text-boza-cream text-center py-2">
      <div className="container mx-auto">
        <p className="text-xs max-w-[600px] mx-auto font-normal">
          SOLDES |{" "}
          <a href="#" className="text-boza-cream text-xs font-normal underline">
            TOUT AFFICHER
          </a>
        </p>
      </div>
    </section>
  );
}