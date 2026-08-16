export default function WishlistEmpty() {
  return (
    <div className="text-center py-20 px-6">
      <div className="w-[90px] h-[90px] bg-boza-cream-alt rounded-full flex items-center justify-center text-[32px] text-boza-taupe mx-auto mb-6">
        <i className="far fa-heart"></i>
      </div>
      <h2 className="font-display text-xl font-black mb-2.5">Aucun favori pour l&apos;instant</h2>
      <p className="text-boza-taupe text-sm mb-[30px]">
        Ajoute des articles à tes favoris en cliquant sur le cœur sur une fiche produit.
      </p>
      <a
        href="/catalogue"
        className="inline-block py-3.5 px-8 bg-boza-black text-boza-cream border border-boza-black text-sm font-bold uppercase tracking-wide no-underline transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown"
      >
        Découvrir la collection
      </a>
    </div>
  );
}