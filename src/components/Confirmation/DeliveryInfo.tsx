type DeliveryInfoProps = {
  address: string;
  paymentMode: string;
};

export default function DeliveryInfo({ address, paymentMode }: DeliveryInfoProps) {
  return (
    <div className="bg-boza-cream border border-boza-cream-alt text-left p-[30px] mb-10">
      <h2 className="font-display text-base font-black uppercase tracking-wide mb-5 pb-4 border-b border-boza-cream-alt">
        Livraison
      </h2>

      <div className="flex gap-4 items-start mb-5">
        <div className="w-9 h-9 bg-boza-cream-alt flex items-center justify-center text-boza-black text-sm shrink-0">
          <i className="fas fa-map-marker-alt"></i>
        </div>
        <div>
          <div className="text-xs text-boza-taupe uppercase tracking-wide mb-1">Adresse de livraison</div>
          <div className="text-sm text-boza-black font-medium leading-relaxed">{address}</div>
        </div>
      </div>

      <div className="flex gap-4 items-start mb-5">
        <div className="w-9 h-9 bg-boza-cream-alt flex items-center justify-center text-boza-black text-sm shrink-0">
          <i className="fas fa-truck"></i>
        </div>
        <div>
          <div className="text-xs text-boza-taupe uppercase tracking-wide mb-1">Livraison estimée</div>
          <div className="text-sm text-boza-black font-medium leading-relaxed">3 à 5 jours ouvrés</div>
        </div>
      </div>

      <div className="flex gap-4 items-start">
        <div className="w-9 h-9 bg-boza-cream-alt flex items-center justify-center text-boza-black text-sm shrink-0">
          <i className="fas fa-credit-card"></i>
        </div>
        <div>
          <div className="text-xs text-boza-taupe uppercase tracking-wide mb-1">Mode de paiement</div>
          <div className="text-sm text-boza-black font-medium leading-relaxed">{paymentMode}</div>
        </div>
      </div>
    </div>
  );
}