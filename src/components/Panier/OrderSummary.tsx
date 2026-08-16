type OrderSummaryProps = {
  itemCount: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
};

export default function OrderSummary({ itemCount, subtotal, discount, tax, total }: OrderSummaryProps) {
  return (
    <div className="bg-boza-cream border border-boza-cream-alt p-[30px] sticky top-5">
      <h3 className="font-display text-xl font-black text-boza-black mb-[25px] pb-5 border-b border-boza-cream-alt">
        Récapitulatif
      </h3>

      <div className="flex justify-between items-center mb-[15px] text-sm">
        <span className="text-boza-taupe font-medium">Sous-total ({itemCount} articles)</span>
        <span className="text-boza-black font-semibold">{subtotal.toFixed(2).replace(".", ",")} €</span>
      </div>

      <div className="flex justify-between items-center mb-[15px] text-sm">
        <span className="text-boza-taupe font-medium">Livraison</span>
        <span className="text-boza-black font-semibold">Gratuite</span>
      </div>

      <div className="flex justify-between items-center mb-[15px] text-sm">
        <span className="text-boza-taupe font-medium">Réduction</span>
        <span className="text-boza-brown font-semibold">-{discount.toFixed(2).replace(".", ",")} €</span>
      </div>

      <div className="flex justify-between items-center mb-[15px] text-sm">
        <span className="text-boza-taupe font-medium">Taxes (TVA 20%)</span>
        <span className="text-boza-black font-semibold">{tax.toFixed(2).replace(".", ",")} €</span>
      </div>

      <div className="h-px bg-boza-cream-alt my-5"></div>

      <div className="flex justify-between items-center p-5 bg-boza-cream-alt my-5">
        <span className="text-base font-semibold text-boza-black">Total</span>
        <span className="font-display text-2xl font-black text-boza-black">{total.toFixed(2).replace(".", ",")} €</span>
      </div>

      <a href="/checkout" className="w-full py-[18px] bg-boza-black text-boza-cream border border-boza-black font-bold text-[15px] uppercase tracking-wide cursor-pointer transition-all duration-300 mb-[15px] hover:bg-boza-brown hover:border-boza-brown text-center no-underline block">
         Passer la Commande
      </a>

      <a href="/catalogue" className="w-full py-4 bg-boza-cream text-boza-black border border-boza-black font-bold text-sm cursor-pointer transition-all duration-300 text-center no-underline block hover:bg-boza-cream-alt">
        <i className="fas fa-arrow-left"></i> Continuer mes Achats
      </a>

      <div className="grid grid-cols-2 gap-[15px] mt-[25px] max-[768px]:grid-cols-1">
        <div className="flex items-center gap-2.5 p-3 bg-boza-cream-alt">
          <div className="w-7 h-7 bg-boza-black flex items-center justify-center text-boza-cream text-xs">
            <i className="fas fa-shield-alt"></i>
          </div>
          <div className="text-xs text-boza-black font-medium leading-tight">Paiement 100% Sécurisé</div>
        </div>
        <div className="flex items-center gap-2.5 p-3 bg-boza-cream-alt">
          <div className="w-7 h-7 bg-boza-black flex items-center justify-center text-boza-cream text-xs">
            <i className="fas fa-truck"></i>
          </div>
          <div className="text-xs text-boza-black font-medium leading-tight">Livraison Rapide</div>
        </div>
        <div className="flex items-center gap-2.5 p-3 bg-boza-cream-alt">
          <div className="w-7 h-7 bg-boza-black flex items-center justify-center text-boza-cream text-xs">
            <i className="fas fa-undo"></i>
          </div>
          <div className="text-xs text-boza-black font-medium leading-tight">Retours sous 30 jours</div>
        </div>
        <div className="flex items-center gap-2.5 p-3 bg-boza-cream-alt">
          <div className="w-7 h-7 bg-boza-black flex items-center justify-center text-boza-cream text-xs">
            <i className="fas fa-headset"></i>
          </div>
          <div className="text-xs text-boza-black font-medium leading-tight">Support Client 24/7</div>
        </div>
      </div>
    </div>
  );
}