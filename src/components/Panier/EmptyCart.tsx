export default function EmptyCart() {
  return (
    <div className="text-center py-20 px-5">
      <div className="w-[120px] h-[120px] bg-boza-cream-alt flex items-center justify-center text-[44px] text-boza-taupe mx-auto mb-[30px]">
        <i className="fas fa-shopping-bag"></i>
      </div>
      <h2 className="font-display text-[22px] font-black text-boza-black mb-2.5">Ton panier est vide</h2>
      <p className="text-boza-taupe mb-[30px]">Découvre notre collection et trouve ta prochaine pièce préférée.</p>
      <a href="/catalogue" className="inline-block py-3.5 px-8 bg-boza-black text-boza-cream border border-boza-black font-bold text-sm uppercase tracking-wide no-underline transition-all duration-300 hover:bg-boza-brown hover:border-boza-brown">
        Découvrir la collection
      </a>
    </div>
  );
}